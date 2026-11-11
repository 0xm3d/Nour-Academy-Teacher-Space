# Nour Academy — Teacher Area

A lightweight school management dashboard for taking attendance, tracking student grades, and spotting at-risk students.

This project is a simple front-end app built with Vite and vanilla JavaScript. It helps a teacher quickly:

- search students by name
- filter by class group
- sort by original order, name, or average grade
- add a new student with validation
- mark attendance as absent
- add a grade out of 20
- view summary stats for the class

## Features

- Attendance board for the day
- Student search and group filters
- Student creation form with live validation
- Password-strength indicator for temporary access codes
- Group summary with averages, absences, and alerts
- Responsive layout for desktop and smaller screens

## Tech Stack

- HTML5
- CSS
- JavaScript
- Vite
- Tailwind CSS

## Project structure

```text
.
├── index.html
├── src/
│   ├── data.js
│   ├── main.js
│   └── styles.css
├── package.json
├── vite.config.js
├── dist/
└── node_modules/
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Notes

- The app currently uses mock data stored in `src/data.js`.
- This is a front-end prototype focused on usability and interface behavior, not a backend-connected system.
- It is designed as a simple teacher dashboard for classroom operations.

## Author

Nour Academy Teacher Space
