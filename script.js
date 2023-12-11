document.addEventListener('DOMContentLoaded', function () {
    fetchTasks();
});

const apiUrl = 'https://6566cae864fcff8d730f10cc.mockapi.io/api/v1/task';
let currentFilter = 'all';

function filterTasks(filterType) {
    currentFilter = filterType;
    fetchTasks();
}

function fetchTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            displayTasks(tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        
        if (
            (currentFilter === 'all') ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed)
        ) {
            const listItem = document.createElement('li');
            listItem.className = 'task';

            const taskTitle = document.createElement('span');
            taskTitle.textContent = task.title;

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'task-buttons';

            const editButton = document.createElement('button');
            const img = document.createElement('img');
            img.src = 'edit.png';
            img.alt = 'Edit';
            img.width = 20;
            img.height = 20;
            editButton.appendChild(img);
            editButton.addEventListener('click', () => editTask(task.id, task.title));

            const deleteButton = document.createElement('button');
            const img1 = document.createElement('img');
            img1.src = 'delete.png';
            img1.alt = 'Delete';
            img1.width = 20; 
            img1.height = 20;
            deleteButton.appendChild(img1);
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            const completeButton = document.createElement('button');
            
       
            const img2 = document.createElement('img');
            img2.src = task.completed ? 'undo.png' : 'complete.png'; 
            img2.alt = task.completed ? 'Undo Complete' : 'Complete';
            img2.width = 20;
            img2.height = 20; 

            completeButton.appendChild(img2);
            completeButton.addEventListener('click', () => toggleComplete(task.id, task.completed));    

            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
            buttonsContainer.appendChild(completeButton);

            listItem.appendChild(taskTitle);
            listItem.appendChild(buttonsContainer);

            taskList.appendChild(listItem);
        }
    });
}




function addTask() {
    const taskInput = document.getElementById('taskInput');
    const newTaskTitle = taskInput.value;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle, completed: false })
    })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}

function editTask(taskId, currentTitle) {
    const newTitle = prompt('Edit task:', currentTitle);

    if (newTitle !== null) {
        fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle })
        })
            .then(response => response.json())
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error editing task:', error);
            });
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
        })
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    }
}

function toggleComplete(taskId, isCompleted) {
    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !isCompleted })
    })
        .then(response => response.json())
        .then(() => fetchTasks())
        .catch(error => {
            console.error('Error toggling task completion:', error);
        });
}


document.addEventListener('DOMContentLoaded', function () {

    if (isLoggedIn()) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        fetchTasks();
    }
});

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const authApiUrl = 'https://6566cae864fcff8d730f10cc.mockapi.io/api/v1/user'; 
    fetch(authApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(userData => {
            const foundUser = userData.find(user => user.username === username && user.password === password);
            if (foundUser) {
                document.getElementById('authSection').style.display = 'none';
                document.getElementById('taskManager').style.display = 'block';
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                fetchTasks();
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => {
            loginError.textContent = error.message;
        });
}




function isLoggedIn() {
    const userData = localStorage.getItem('currentUser');
    return userData !== null;
}

function signup() {
    const signupUsernameInput = document.getElementById('signupUsername');
    const signupPasswordInput = document.getElementById('signupPassword');

    const signupUsername = signupUsernameInput.value;
    const signupPassword = signupPasswordInput.value;

    const signupApiUrl = 'https://6566cae864fcff8d730f10cc.mockapi.io/api/v1/user'; 
    fetch(signupApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: signupUsername, password: signupPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error signing up');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        localStorage.setItem('currentUser', JSON.stringify({ username: signupUsername }));
        fetchTasks();
    })
    .catch(error => {
        alert(error.message);
    });
}

function logOut() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}
