document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const userForm = document.getElementById('user-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const userTableBody = document.querySelector('#user-table tbody');
    const feedback = document.getElementById('feedback');
    const userStatusPanel = document.getElementById('user-status-panel');
    const userStatusContent = document.getElementById('user-status-content');
    const closePanelButton = document.getElementById('close-panel-button');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    let isEditing = false;
    let currentUsername = '';

    // Retrieve users from localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Add a new user
    function addUser(user) {
        const users = getUsers();
        users.push(user);
        saveUsers(users);
        renderUsers();
        showFeedback('User added successfully!', 'success');
    }

    // Update an existing user
    function updateUser(username, updatedUser) {
        const users = getUsers();
        const userIndex = users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            saveUsers(users);
            renderUsers();
            showFeedback('User updated successfully!', 'update');
        }
    }

    // Delete a user
    function deleteUser(username, email) {
        const users = getUsers();
        const updatedUsers = users.filter(user => user.username !== username || user.email !== email);
        saveUsers(updatedUsers);
        renderUsers();
        showFeedback('User deleted successfully!', 'delete');
    }

    // Render users in the table
    function renderUsers() {
        const users = getUsers();
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td class="actions">
                    <button class="status" data-username="${user.username}" data-email="${user.email}">Status</button>
                    <button class="edit" data-username="${user.username}">Edit</button>
                    <button class="delete" data-username="${user.username}" data-email="${user.email}">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // Show feedback message
    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }

    // Validate form inputs
    function validateForm() {
        if (usernameInput.value.trim() === '' || emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
            showFeedback('All fields are required!', 'error');
            return false;
        }
        return true;
    }

    // Handle form submission
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            const user = {
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                createdAt: new Date().toISOString(), // Creation date
                lastConnected: null // Last connection date, initially null
            };
            if (isEditing) {
                updateUser(currentUsername, user);
                isEditing = false;
                currentUsername = '';
            } else {
                addUser(user);
            }
            userForm.reset();
        }
    });

    // Handle edit, delete, and status button clicks
    userTableBody.addEventListener('click', function (e) {
        const target = e.target.closest('button');
        if (!target) return;

        const username = target.getAttribute('data-username');
        const email = target.getAttribute('data-email');
        const users = getUsers();
        const user = users.find(user => user.username === username);

        if (target.classList.contains('edit')) {
            if (user) {
                usernameInput.value = user.username;
                emailInput.value = user.email;
                passwordInput.value = user.password;
                isEditing = true;
                currentUsername = username;
            }
        } else if (target.classList.contains('delete')) {
            deleteUser(username, email);
        } else if (target.classList.contains('status')) {
            if (userStatusPanel.style.display === 'block') {
                closeUserStatusPanel();
            }
            showUserStatus(user);
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('mousedown', function (e) {
        e.preventDefault(); // Prevent default action
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.src = type === 'password' 
            ? (isDarkMode ? '/public/img/hide-white.svg' : '/public/img/hide-black.svg') 
            : (isDarkMode ? '/public/img/show-white.svg' : '/public/img/show-black.svg');
        passwordInput.focus(); // Keep input focused
    });

    // Show user status panel
    function showUserStatus(user) {
        userStatusContent.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Created At:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Last Connected:</strong> ${user.lastConnected ? new Date(user.lastConnected).toLocaleString() : 'Never connected'}</p>
        `;
        userStatusPanel.style.display = 'block';
    }

    // Close user status panel
    function closeUserStatusPanel() {
        userStatusPanel.style.display = 'none';
    }

    // Close panel when clicking outside of it
    window.addEventListener('click', function (e) {
        if (e.target === userStatusPanel) {
            closeUserStatusPanel();
        }
    });

    closePanelButton.addEventListener('click', closeUserStatusPanel);

    // Handle theme toggle
    themeToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggleButton.querySelector('img').src = isDarkMode ? '/public/img/sun.png' : '/public/img/moon.png';
        togglePassword.src = isDarkMode ? '/public/img/hide-white.svg' : '/public/img/hide-black.svg';
    });

    // Initial render of users
    renderUsers();

    // Auto-refresh the user table every 30 seconds
    setInterval(renderUsers, 30000);
  
});
`    `