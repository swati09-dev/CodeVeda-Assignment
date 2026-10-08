# TaskMate – To-Do List App

## About
TaskMate is a simple to-do list application built as part of the Codveda Web Development Internship – Level 2, Task 2. It lets you add, edit, delete and complete tasks, and everything is saved in the browser so your tasks stay even after refreshing or reopening the page.

## Features
- Add tasks
- Edit tasks (inline editing)
- Delete tasks
- Mark tasks as complete (with line-through styling)
- Filter tasks: All / Active / Completed
- Task counter (Total, Active, Completed)
- Local Storage persistence — tasks survive page refresh and browser reopen
- Responsive design (desktop, tablet, mobile)
- Empty task validation

## Technologies
- HTML5
- CSS3
- JavaScript (Vanilla)
- Browser Local Storage

## How It Works
Tasks are stored as a JSON array in `localStorage` under the key `taskmate_tasks`. Every time a task is added, edited, deleted or completed, the array is updated and saved back to Local Storage using `JSON.stringify()`. When the page loads, the saved data is read back using `JSON.parse()` and displayed.

## How to Run
Open `index.html` in any web browser. No installation or server needed.

## Author
Swati Singh
BCA Student | Full Stack Web Developer
swatisingh739383@gmail.com
GitHub: https://github.com/swati09-dev
LinkedIn: https://www.linkedin.com/in/swati-singh-codes/
