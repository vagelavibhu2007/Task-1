const API_URL = 'http://127.0.0.1:5000/tasks';

// Load tasks on startup
window.onload = fetchTasks;

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        const tasks = await res.json();
        renderBoard(tasks);
    } catch (err) {
        console.error("Backend not running!");
    }
}

function renderBoard(tasks) {
    const containers = {
        Todo: document.querySelector('#Todo .list'),
        InProgress: document.querySelector('#InProgress .list'),
        Done: document.querySelector('#Done .list')
    };

    // Clear all columns
    Object.values(containers).forEach(el => el.innerHTML = '');

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description || ''}</p>
            <div class="actions">
                <button onclick="updateStatus(${task.id}, 'Todo')">Todo</button>
                <button onclick="updateStatus(${task.id}, 'InProgress')">Process</button>
                <button onclick="updateStatus(${task.id}, 'Done')">Done</button>
                <button class="edit-btn" onclick="editTask(${task.id}, '${task.title}')">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        containers[task.status].appendChild(card);
    });
}

async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const status = document.getElementById('taskStatus').value;

    if (!title) return alert("Please enter a title");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status })
    });

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    fetchTasks();
}

async function updateStatus(id, newStatus) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
}

async function editTask(id, oldTitle) {
    const newTitle = prompt("Edit Task Title:", oldTitle);
    if (!newTitle) return;
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    });
    fetchTasks();
}

async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

function renderBoard(tasks) {
    const containers = {
        Todo: document.querySelector('#Todo .list'),
        InProgress: document.querySelector('#InProgress .list'),
        Done: document.querySelector('#Done .list')
    };

    Object.values(containers).forEach(el => el.innerHTML = '');

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        // IMPORTANT: We put quotes around ${task.id} so it stays a string
        card.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description || ''}</p>
            <div class="actions">
                <button onclick="updateStatus('${task.id}', 'Todo')">Todo</button>
                <button onclick="updateStatus('${task.id}', 'InProgress')">Process</button>
                <button onclick="updateStatus('${task.id}', 'Done')">Done</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        containers[task.status].appendChild(card);
    });
}

async function deleteTask(id) {
    console.log("Deleting ID:", id); // Check F12 console to see the ID
    if (!confirm("Delete this task?")) return;

    const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
    });

    if (response.ok) {
        fetchTasks(); // Reload the board
    } else {
        alert("Delete failed on server.");
    }
}