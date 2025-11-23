document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const signInButton = document.querySelector('.sign-in-button');
    const togglePassword = document.getElementById('toggle-password');
    const rememberMeCheckbox = document.getElementById('rememberme');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.display = 'none';
    document.querySelector('.input_userpwd').appendChild(errorMessage);

    // Handle login
    function login(event) {
        event.preventDefault(); // Prevent form submission

        // Fetch users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        const userIndex = users.findIndex(user => user.username === enteredUsername && user.password === enteredPassword);

        if (userIndex !== -1) {
            const user = users[userIndex];
            user.lastConnected = new Date().toISOString(); // Update last connected date
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users)); // Save updated users list

            if (rememberMeCheckbox.checked) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            }
            // Redirect to preloader, which will then redirect to home page
            window.location.href = '/preloader/preloader.html';
        } else {
            showError('Invalid username or password');
        }
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Validate input fields
    function validateInputs() {
        const isUsernameValid = usernameInput.value.trim() !== '';
        const isPasswordValid = passwordInput.value.trim() !== '';
        signInButton.disabled = !(isUsernameValid && isPasswordValid);
        if (isUsernameValid && isPasswordValid) {
            hideError();
        }
    }

    // Toggle password visibility
    togglePassword.addEventListener('mousedown', function (e) {
        e.preventDefault(); // Prevent default action
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.src = type === 'password' ? '/img/hide.svg' : '/img/show.svg';
        passwordInput.focus(); // Keep input focused
    });

    // Add event listeners for input validation
    usernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);

    // Add event listener for login button
    signInButton.addEventListener('click', login);

    // Initial validation check
    validateInputs();

    // Check if user is already logged in and "Stay signed in" was checked
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        const continueWithUser = confirm(`Do you want to continue as ${loggedInUser.username}?`);
        if (continueWithUser) {
            // Redirect to preloader if user chooses to continue
            window.location.href = '/preloader/preloader.html';
        } else {
            // Clear the stored user information if user chooses not to continue
            localStorage.removeItem('loggedInUser');
        }
    }
});