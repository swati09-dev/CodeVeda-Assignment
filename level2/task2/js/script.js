let tasks = [];
let currentFilter = 'all';

function loadTasks() {
    const stored = localStorage.getItem('taskmate_tasks');
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            tasks = [];
        }
    }
}

function saveTasks() {
    localStorage.setItem('taskmate_tasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter(function (t) { return !t.completed; });
    }
    if (currentFilter === 'completed') {
        return tasks.filter(function (t) { return t.completed; });
    }
    return tasks;
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyMsg = document.getElementById('emptyMsg');
    const filtered = getFilteredTasks();

    taskList.innerHTML = '';

    if (filtered.length === 0) {
        emptyMsg.classList.add('visible');
    } else {
        emptyMsg.classList.remove('visible');
    }

    filtered.forEach(function (task) {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.setAttribute('data-id', task.id);

        li.innerHTML =
            '<input type="checkbox" class="task-checkbox" ' + (task.completed ? 'checked' : '') + '>' +
            '<span class="task-text">' + escapeHTML(task.text) + '</span>' +
            '<div class="task-actions">' +
                '<button class="btn-edit">Edit</button>' +
                '<button class="btn-delete">Delete</button>' +
            '</div>';

        taskList.appendChild(li);
    });

    updateCounter();
}

// escape user input to avoid XSS when using innerHTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function updateCounter() {
    const total     = tasks.length;
    const completed = tasks.filter(function (t) { return t.completed; }).length;
    const active    = total - completed;
    document.getElementById('taskCounter').textContent =
        'Total: ' + total + '  |  Active: ' + active + '  |  Completed: ' + completed;
}

function addTask() {
    const input    = document.getElementById('taskInput');
    const errorMsg = document.getElementById('errorMsg');
    const text     = input.value.trim();

    if (text === '') {
        errorMsg.textContent = 'Please enter a task.';
        input.focus();
        return;
    }

    errorMsg.textContent = '';

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    input.value = '';
    input.focus();
}

function toggleTask(id) {
    const task = tasks.find(function (t) { return t.id === id; });
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderTasks();
}

function startEdit(id, li) {
    const task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    const textSpan = li.querySelector('.task-text');
    const actions  = li.querySelector('.task-actions');

    const editInput = document.createElement('input');
    editInput.type      = 'text';
    editInput.className = 'edit-input';
    editInput.value     = task.text;
    editInput.maxLength = 150;

    li.replaceChild(editInput, textSpan);
    editInput.focus();

    actions.innerHTML =
        '<button class="btn-save">Save</button>' +
        '<button class="btn-delete">Delete</button>';

    actions.querySelector('.btn-save').addEventListener('click', function () {
        saveEdit(id, li, editInput);
    });

    editInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            saveEdit(id, li, editInput);
        }
    });

    actions.querySelector('.btn-delete').addEventListener('click', function () {
        deleteTask(id);
    });
}

function saveEdit(id, li, editInput) {
    const newText = editInput.value.trim();
    if (newText === '') {
        editInput.style.borderColor = '#DC2626';
        editInput.focus();
        return;
    }

    const task = tasks.find(function (t) { return t.id === id; });
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
    }
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    renderTasks();
}

document.getElementById('addBtn').addEventListener('click', addTask);

document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.getElementById('taskInput').addEventListener('input', function () {
    document.getElementById('errorMsg').textContent = '';
});

document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        setFilter(btn.getAttribute('data-filter'));
    });
});

// event delegation — one listener handles all task clicks
document.getElementById('taskList').addEventListener('click', function (e) {
    const li = e.target.closest('.task-item');
    if (!li) return;

    const id = parseInt(li.getAttribute('data-id'));

    if (e.target.classList.contains('task-checkbox')) {
        toggleTask(id);
    }
    if (e.target.classList.contains('btn-edit')) {
        startEdit(id, li);
    }
    if (e.target.classList.contains('btn-delete')) {
        deleteTask(id);
    }
});

loadTasks();
renderTasks();
