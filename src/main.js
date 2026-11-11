
import './styles.css';
import { students, groups } from './data.js';

const studentList = document.querySelector('#student-list');
const search = document.querySelector('#search');
const groupFilter = document.querySelector('#group-filter');
const studentCount = document.querySelector('#counter');
const noResults = document.querySelector('#no-results');
const summaryAverage = document.querySelector('#summary-average');
const summaryAbsences = document.querySelector('#summary-absences');
const summaryAlerts = document.querySelector('#summary-alerts');
const summaryBest = document.querySelector('#summary-best');
const parentsList = document.querySelector('#parents-list');
const noAlerts = document.querySelector('#no-alerts');
const studentForm = document.querySelector('#student-form');
const formSuccess = document.querySelector('#form-success');
const formError = document.querySelector('#form-error');
const codeStrength = document.querySelector('#code-strength');
const addStudentGroup = document.querySelector('#group');
const fields = [...studentForm.querySelectorAll('.field')];

const validators = {
  'first-name': {
    test: value => value.length >= 2 && /^[\p{L}][\p{L} -]*[\p{L}]$/u.test(value),
    error: 'Use at least 2 letters, spaces or hyphens.',
    success: 'First name looks good.'
  },
  'last-name': {
    test: value => value.length >= 2 && /^[\p{L}][\p{L} -]*[\p{L}]$/u.test(value),
    error: 'Use at least 2 letters, spaces or hyphens.',
    success: 'Last name looks good.'
  },
  group: {
    test: value => groups.some(group => group.id === Number(value)),
    error: 'Choose a group.',
    success: 'Group selected.'
  },
  email: {
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    error: 'Enter a valid email address.',
    success: 'Email address looks good.'
  },
  phone: {
    test: value => /^(?:0[67]\d{8}|\+212[67]\d{8})$/.test(value),
    error: 'Use 06/07 or +212 6/7, followed by 8 digits.',
    success: 'Phone number looks good.'
  },
  code: {
    test: value => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value),
    error: 'Use 8+ characters, including an uppercase letter, a number and a special character.',
    success: 'Access code looks good.'
  }
};

// Keep each field's short hint available when its value is cleared.
fields.forEach(function (field) {
  field.dataset.help = field.querySelector('.message').textContent;
});

// Create a card for one student
function createStudentCard(student) {

  const li = document.createElement('li');
  li.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3");

  // Alert at 3 absences
  if (student.absences >= 3) {
    li.classList.add("border-red-500", "bg-red-100");
  }

  const div = document.createElement('div');
  div.classList.add("flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center");

  // Student information button
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add("btn-fiche", "flex", "min-h-11", "flex-1", "items-center", "gap-3", "text-left");

  // Avatar
  const avatar = document.createElement('span');
  avatar.classList.add("grid", "size-10", "shrink-0", "place-items-center", "rounded-full", "bg-brand-soft", "text-sm", "font-semibold", "text-brand");
  avatar.textContent = student.firstName[0] + student.lastName[0];

  // Student information
  const info = document.createElement('span');
  info.classList.add("min-w-0", "flex-1");

  const name = document.createElement('span');
  name.classList.add("block", "truncate", "font-medium");
  name.textContent = student.firstName + ' ' + student.lastName;

  const absences = document.createElement('span');
  absences.classList.add("block", "text-sm", "text-muted");
  absences.textContent = student.absences + ' absence';

  // Parent warning badge
  if (student.absences >= 3) {
    const badge = document.createElement('span');
    badge.textContent = 'Prévenir les parents';
    badge.classList.add("text-xs", "font-semibold", "text-red-600");

    info.append(name, absences, badge);
  } else {
    info.append(name, absences);
  }

  // Calculate average
  const average = document.createElement('span');
  average.classList.add("font-serif", "text-xl");

  if (student.grades.length === 0) {
    average.textContent = '—';
  } else {
    let total = 0;

    for (let grade of student.grades) {
      total = total + grade;
    }

    average.textContent =
      (total / student.grades.length).toFixed(1) + ' / 20';
  }

  button.append(avatar, info, average);

  // Attendance and grade controls
  const controls = document.createElement('div');
  controls.classList.add("flex", "gap-2");

  // Absent button
  const absentButton = document.createElement('button');
  absentButton.type = 'button';
  absentButton.classList.add("btn-absent", "h-11", "rounded-full", "border", "border-line", "px-3", "sm:px-4", "text-sm", "font-medium", "hover:bg-paper");
  absentButton.textContent = 'Absent';
  absentButton.dataset.id = student.id;
  absentButton.dataset.action = 'absent';

  // Grade input
  const label = document.createElement('label');
  label.classList.add("flex-1");

  const srOnly = document.createElement('span');
  srOnly.classList.add("sr-only");
  srOnly.textContent = 'Note sur 20';

  const gradeInput = document.createElement('input');
  gradeInput.type = 'number';
  gradeInput.min = '0';
  gradeInput.max = '20';
  gradeInput.step = '0.5';
  gradeInput.placeholder = 'Note';
  gradeInput.classList.add("h-11", "w-full", "rounded-full", "border", "border-line", "bg-paper", "px-4", "text-sm", "lg:w-24");

  label.append(srOnly, gradeInput);

  // Add grade button
  const noteButton = document.createElement('button');
  noteButton.type = 'button';
  noteButton.classList.add("btn-note", "h-11", "rounded-full", "bg-ink", "px-3", "sm:px-4", "text-sm", "font-medium", "text-white", "hover:bg-brand");
  noteButton.textContent = 'Ajouter la note';
  noteButton.dataset.id = student.id;
  noteButton.dataset.action = 'grade';

  controls.append(absentButton, label, noteButton);

  div.append(button, controls);
  li.append(div);

  // Grade error message
  const message = document.createElement('p');
  message.classList.add("message", "mt-2", "text-xs", "text-alert");
  message.textContent = 'La note doit être un nombre entre 0 et 20.';
  message.hidden = true;

  li.append(message);

  return li;
}


// Add groups to selector
groups.forEach(function (group) {

  const option = document.createElement('option');

  option.value = group.id;
  option.textContent = group.name;

  groupFilter.append(option);

  const formOption = option.cloneNode(true);
  addStudentGroup.append(formOption);
});

function updateField(field, state, message) {
  const input = field.querySelector('input, select');
  const messageElement = field.querySelector('.message');

  field.classList.remove('valid', 'error');

  if (state === 'neutral') {
    input.removeAttribute('aria-invalid');
    messageElement.textContent = field.dataset.help;
    return;
  }

  field.classList.add(state);
  input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
  messageElement.textContent = message;
}

function validateForm(showEmptyFields) {
  const results = fields.map(function (field) {
    const input = field.querySelector('input, select');
    const value = input.value.trim();
    const rule = validators[input.id];
    const isValid = rule.test(value);

    return {
      field,
      input,
      value,
      isValid,
      message: isValid ? rule.success : rule.error
    };
  });

  const firstName = results.find(result => result.input.id === 'first-name');
  const lastName = results.find(result => result.input.id === 'last-name');
  const groupResult = results.find(result => result.input.id === 'group');
  let duplicate = false;
  let groupIsFull = false;

  if (firstName.isValid && lastName.isValid && groupResult.isValid) {
    const groupId = Number(groupResult.value);
    const normalizedFirstName = firstName.value.toLocaleLowerCase();
    const normalizedLastName = lastName.value.toLocaleLowerCase();

    duplicate = students.some(function (student) {
      return student.groupId === groupId &&
        student.firstName.toLocaleLowerCase() === normalizedFirstName &&
        student.lastName.toLocaleLowerCase() === normalizedLastName;
    });

    groupIsFull = students.filter(student => student.groupId === groupId).length >= 15;

    if (duplicate) {
      groupResult.isValid = false;
      groupResult.message = 'This student already exists in this group.';
    } else if (groupIsFull) {
      groupResult.isValid = false;
      groupResult.message = 'This group already has 15 students.';
    }
  }

  results.forEach(function (result) {
    const hasValue = result.value !== '';
    const wasChecked = result.field.classList.contains('valid') ||
      result.field.classList.contains('error');

    if (showEmptyFields || hasValue || wasChecked) {
      updateField(result.field, result.isValid ? 'valid' : 'error', result.message);
    } else {
      updateField(result.field, 'neutral');
    }
  });

  return {
    isValid: results.every(result => result.isValid),
    duplicate,
    groupIsFull,
    results
  };
}

function updateCodeStrength() {
  const value = document.querySelector('#code').value;
  let score = 0;

  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;

  codeStrength.value = score;
}

function updateGroupSummary() {
  const selectedGroup = groupFilter.value;
  const groupStudents = students.filter(student =>
    selectedGroup === '' || student.groupId === Number(selectedGroup)
  );
  const grades = groupStudents.reduce(function (result, student) {
    return {
      total: result.total + student.grades.reduce((sum, grade) => sum + grade, 0),
      count: result.count + student.grades.length
    };
  }, { total: 0, count: 0 });
  const totalAbsences = groupStudents.reduce(
    (total, student) => total + student.absences,
    0
  );
  const studentsOnAlert = groupStudents.filter(student => student.absences >= 3);

  summaryAverage.textContent = grades.count === 0
    ? '—'
    : (grades.total / grades.count).toLocaleString('fr-FR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  summaryAbsences.textContent = totalAbsences;
  summaryAlerts.textContent = studentsOnAlert.length;

  const bestStudent = groupStudents.reduce(function (best, student) {
    if (student.grades.length === 0) return best;

    const average = student.grades.reduce((sum, grade) => sum + grade, 0) /
      student.grades.length;
    return best === null || average > best.average ? { student, average } : best;
  }, null);

  summaryBest.textContent = bestStudent
    ? bestStudent.student.firstName + ' ' + bestStudent.student.lastName +
      ' · ' + bestStudent.average.toLocaleString('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }) + ' / 20'
    : '—';

  parentsList.replaceChildren(...studentsOnAlert.map(function (student) {
    const item = document.createElement('li');
    item.className = 'rounded-xl bg-card p-3 ring-1 ring-line';
    item.textContent = student.firstName + ' ' + student.lastName +
      ' — ' + student.parentPhone;
    return item;
  }));
  noAlerts.hidden = !groupStudents.every(student => student.absences < 3);
}

studentForm.addEventListener('input', function (event) {
  formSuccess.hidden = true;
  formError.hidden = true;
  validateForm(false);

  if (event.target.id === 'code') {
    updateCodeStrength();
  }
});

studentForm.addEventListener('change', function () {
  formSuccess.hidden = true;
  formError.hidden = true;
  validateForm(false);
});

studentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const validation = validateForm(true);

  if (!validation.isValid) {
    const firstInvalid = validation.results.find(result => !result.isValid);

    if (firstInvalid) {
      firstInvalid.input.focus();
    }

    if (validation.duplicate || validation.groupIsFull) {
      formError.textContent = validation.duplicate
        ? 'This student already exists in this group.'
        : 'This group is full (15 students).';
      formError.hidden = false;
    }

    return;
  }

  const formData = new FormData(studentForm);

  // Store the student details, but never keep the temporary access code.
  students.push({
    id: Math.max(0, ...students.map(student => student.id)) + 1,
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    groupId: Number(formData.get('group')),
    parentEmail: formData.get('email').trim(),
    parentPhone: formData.get('parentPhone').trim(),
    absences: 0,
    grades: []
  });

  studentForm.reset();
  codeStrength.value = 0;
  fields.forEach(field => updateField(field, 'neutral'));
  search.value = '';
  groupFilter.value = '';
  formError.hidden = true;
  formSuccess.hidden = false;
  displayStudents();
});


// Display and filter students
function displayStudents() {

  const searchedText = search.value.toLowerCase().trim();
  const selectedGroup = groupFilter.value;

  const filteredStudent = students.filter(function (student) {

    const matchesSearch =
      student.firstName.toLowerCase().includes(searchedText) ||
      student.lastName.toLowerCase().includes(searchedText);

    const matchesGroup =
      selectedGroup === '' || student.groupId === Number(selectedGroup);

    return matchesSearch && matchesGroup;
  });

  studentList.textContent = '';

  const cards = filteredStudent.map(createStudentCard);

  studentList.append(...cards);

  // Update counter
  studentCount.textContent = filteredStudent.length + ' students';

  noResults.hidden = filteredStudent.length !== 0;
  updateGroupSummary();
}


// One event listener for Absent and Add grade
studentList.addEventListener('click', function (event) {

  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  // Find student using data-id
  const studentId = Number(button.dataset.id);

  const student = students.find(function (student) {
    return student.id === studentId;
  });

  if (!student) {
    return;
  }

  const li = button.closest('li');

  // Absent
  if (button.dataset.action === 'absent') {
    student.absences++;
  }

  // Add grade
  if (button.dataset.action === 'grade') {

    const gradeInput = li.querySelector('input[type="number"]');
    const message = li.querySelector('.message');

    const grade = Number(gradeInput.value);

    if (
      gradeInput.value.trim() === '' ||
      !Number.isFinite(grade) ||
      grade < 0 ||
      grade > 20
    ) {
      message.hidden = false;
      return;
    }

    student.grades.push(grade);
  }

  // Update only the concerned student
  li.replaceWith(createStudentCard(student));
  updateGroupSummary();

});


// Search event
search.addEventListener('input', displayStudents);

// Group filter event
groupFilter.addEventListener('change', displayStudents);


// Initial display
displayStudents();
