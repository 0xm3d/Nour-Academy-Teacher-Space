import './styles.css';
import { students, groups } from './data.js';

const studentList = document.querySelector('#student-list');
const search = document.querySelector('#search');
const groupFilter = document.querySelector('#group-filter');
const studentCount = document.querySelector('#counter');
const noResults = document.querySelector('#no-results');


function createStudentCard(student) {
  const li = document.createElement('li');
  li.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3");
  li.dataset.id = student.id;

  const div = document.createElement('div');
  div.classList.add("flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center");

  // Student information button
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add("btn-fiche", "flex", "min-h-11", "flex-1", "items-center", "gap-3", "text-left");

  // Student avatar
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

   info.append(name, absences);

  if (student.absences >= 3) {
    li.classList.add("border", "border-solid","border-red-500", "bg-red-100")
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

    average.textContent = (total / student.grades.length).toFixed(1) + ' / 20';
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


// Create a card for each student and add them to the list
const cards = students.map(createStudentCard);
studentList.append(...cards);





// add options to groups selector
groups.forEach(function (group) {
  const option = document.createElement('option');

  option.value = group.id;
  option.textContent = group.name;

  groupFilter.append(option);
});


// Filter
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

  // Add the cards to the student list
  studentList.append(...cards);

  // Update the counter
  studentCount.textContent = filteredStudent.length + ' students';

  noResults.hidden = filteredStudent.length !== 0;
}



search.addEventListener('input', displayStudents);
groupFilter.addEventListener('change', displayStudents);



displayStudents();