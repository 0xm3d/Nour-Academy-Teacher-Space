
import './styles.css';
import { students, groups } from './data.js';

const studentList = document.querySelector('#student-list');
const search = document.querySelector('#search');
const groupFilter = document.querySelector('#group-filter');
const studentCount = document.querySelector('#counter');
const noResults = document.querySelector('#no-results');


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

});


// Search event
search.addEventListener('input', displayStudents);

// Group filter event
groupFilter.addEventListener('change', displayStudents);


// Initial display
displayStudents();
