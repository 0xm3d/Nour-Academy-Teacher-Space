
import './styles.css';
import { students } from './data.js';

const studentList = document.querySelector('#student-list');

function createStudentCard(student) {

  const li = document.createElement('li');
  li.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3");


  const div = document.createElement('div');
  div.classList.add("flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center");

  const span = document.create

  const button = document.createElement('button');
  button.classList.add("btn-fiche", "flex", "min-h-11", "flex-1", "items-center", "gap-3", "text-left");
  button.type = 'button';

  // Create the student avatar with initials
  const avatar = document.createElement('span');
  avatar.classList.add("grid", "size-10", "shrink-0", "place-items-center", "rounded-full", "bg-brand-soft", "text-sm", "font-semibold", "text-brand");
  avatar.textContent = student.firstName[0] + student.lastName[0];

  // Create the student information container
  const info = document.createElement('span');
  info.classList.add("min-w-0", "flex-1");

  // Display the student's full name
  const name = document.createElement('span');
  name.classList.add("block", "truncate", "font-medium");
  name.textContent = student.firstName + ' ' + student.lastName;

  // number of absences
  const absences = document.createElement('span');
  absences.classList.add("block", "text-sm", "text-muted");
  absences.textContent = student.absences + ' absences';


  info.append(name, absences);

  // Create the average grade element
  const average = document.createElement('span');
  average.classList.add("font-serif", "text-xl");

  // Check if the student has any grades
  if (student.grades.length === 0) {
    average.textContent = '—';
  } else {
    // Calculate the total of all grades
    let total = 0;

    for (let grade of student.grades) {
      total = total + grade;
    }

    // Calculate and display the average
    average.textContent = (total / student.grades.length).toFixed(1) + ' / 20';
  }

  button.append(avatar, info, average);
  div.append(button);
  li.append(div);

  return li;
}


// Create a card for each student and add them to the list
const cards = students.map(createStudentCard);
studentList.append(...cards);
