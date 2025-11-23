document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const video = document.getElementById('background-video');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const buttons = document.querySelectorAll('.sign-in-button');
    const root = document.getElementById('root');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const requirements = document.querySelectorAll('.requirement');
    const passwordStrength = document.getElementById('password-strength');
    const confirmPasswordStrength = document.createElement('div');
    confirmPasswordStrength.id = 'confirm-password-strength';
    confirmPasswordStrength.className = 'password-strength';
    confirmPasswordInput.parentNode.insertBefore(confirmPasswordStrength, confirmPasswordInput.nextSibling);
    const submitButton = document.querySelector('.sign-in-button[data-next="animation-section"]');
    const birthdayInput = document.getElementById('birthday');
    const birthdayGroup = document.getElementById('birthday-group');
    const birthdayInputs = document.querySelectorAll('.input-day, .input-month, .input-year');
    const emailInput = document.getElementById('email');
    const emailButton = document.querySelector('.sign-in-button[data-next="birthday-section"]');
    const birthdayButton = document.querySelector('.sign-in-button[data-next="username-section"]');
    const usernameInput = document.getElementById('username');
    const usernameButton = document.querySelector('.sign-in-button[data-next="password-section"]');
    const passwordSectionButton = document.querySelector('.sign-in-button.nav-but[data-next="animation-section"]');

    // Play video on window load
    window.onload = function () {
        video.play();
        video.muted = false;
    }

    // Validate email input
    function validateEmail() {
        const email = emailInput.value;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        emailButton.disabled = !isValidEmail;
    }

    // Validate birthday input
    function validateBirthday() {
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const isValidDay = day >= 1 && day <= 31;
        const isValidMonth = month >= 1 && month <= 12;
        const isValidYear = year.length === 4 && year >= 1900 && year <= new Date().getFullYear();
        birthdayButton.disabled = !(isValidDay && isValidMonth && isValidYear);
    }

    // Validate username input
    function validateUsername() {
        const username = usernameInput.value;
        const isValidUsername = username.length > 3; // Example validation: username must be at least 3 characters long
        usernameButton.disabled = !isValidUsername;
    }

    // Validate password input
    function validatePassword() {
        const password = passwordInput.value;
        let validCount = 0;

        // Check if password is at least 8 characters long
        if (password.length >= 8) {
            requirements[1].classList.add('valid');
            validCount++;
        } else {
            requirements[1].classList.remove('valid');
        }

        // Check if password includes two of the following: letter, number, or symbol
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if ((hasLetter && hasNumber) || (hasLetter && hasSymbol) || (hasNumber && hasSymbol)) {
            requirements[2].classList.add('valid');
            validCount++;
        } else {
            requirements[2].classList.remove('valid');
        }

        // Check if password strength is Okay or better (simple example)
        if (validCount >= 2) {
            requirements[0].classList.add('valid');
        } else {
            requirements[0].classList.remove('valid');
        }

        // Update password strength message and input border color
        if (validCount === 0) {
            passwordStrength.textContent = 'Too weak';
            passwordStrength.className = 'password-strength weak';
            passwordInput.classList.add('weak');
            passwordInput.classList.remove('okay', 'strong');
        } else if (validCount === 1) {
            passwordStrength.textContent = 'Okay';
            passwordStrength.className = 'password-strength okay';
            passwordInput.classList.add('okay');
            passwordInput.classList.remove('weak', 'strong');
        } else {
            passwordStrength.textContent = 'Great';
            passwordStrength.className = 'password-strength strong';
            passwordInput.classList.add('strong');
            passwordInput.classList.remove('weak', 'okay');
        }

        validateConfirmPassword();
        updateSubmitButtonState();
    }

    // Validate confirm password input
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            confirmPasswordStrength.textContent = 'Passwords do not match';
            confirmPasswordStrength.className = 'password-strength mismatch';
            confirmPasswordInput.classList.add('mismatch');
        } else {
            confirmPasswordStrength.textContent = '';
            confirmPasswordStrength.className = 'password-strength';
            confirmPasswordInput.classList.remove('mismatch');
        }

        updateSubmitButtonState();
    }

    // Update submit button state
    function updateSubmitButtonState() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const isPasswordValid = requirements[0].classList.contains('valid') &&
            requirements[1].classList.contains('valid') &&
            requirements[2].classList.contains('valid');
        const isConfirmPasswordValid = password === confirmPassword;
        const areInputsFilled = password !== '' && confirmPassword !== '';

        if (isPasswordValid && isConfirmPasswordValid && areInputsFilled) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Create account and save to localStorage
    function createAccount(event) {
        event.preventDefault(); // Prevent form submission
        const user = {
            email: emailInput.value,
            username: usernameInput.value,
            password: passwordInput.value,
            birthday: {
                day: document.getElementById('day').value,
                month: document.getElementById('month').value,
                year: document.getElementById('year').value
            }
        };

        // Fetch existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Add new user to the list
        users.push(user);

        // Save updated users list to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        console.log('Account created:', user);

        // Show "Account created" message after 5 seconds
        setTimeout(() => {
            document.querySelector('.ui-text span').textContent = 'Account created';
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login/login.html';
            }, 2000);
        }, 5000);
    }

    // Add event listeners for input validation
    emailInput.addEventListener('input', validateEmail);
    birthdayInputs.forEach(input => input.addEventListener('input', validateBirthday));
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // Add focus and blur event listeners for password input
    passwordInput.addEventListener('focus', function () {
        this.classList.add('focused');
        if (this.classList.contains('weak')) {
            this.classList.add('weak');
        } else if (this.classList.contains('okay')) {
            this.classList.add('okay');
        } else if (this.classList.contains('strong')) {
            this.classList.add('strong');
        }
    });

    passwordInput.addEventListener('blur', function () {
        this.classList.remove('focused');
        this.classList.remove('weak', 'okay', 'strong'); // Remove border color classes when not focused
    });

    // Add event listeners for navigation items
    navItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            const currentSection = document.querySelector('.section.active');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const isNextSection = index === currentIndex + 1;
            const isPreviousSection = index === currentIndex - 1;

            if (isNextSection || isPreviousSection) {
                if (isNextSection && !buttons[currentIndex].disabled) {
                    navItems.forEach(nav => nav.classList.remove('selected'));
                    sections.forEach(section => section.classList.remove('active'));
                    this.classList.add('selected');
                    document.getElementById(target).classList.add('active');
                    if (target === 'birthday-section' || target === 'username-section') {
                        root.style.height = '450px';
                    } else {
                        root.style.height = '607px';
                    }
                } else if (isPreviousSection) {
                    navItems.forEach(nav => nav.classList.remove('selected'));
                    sections.forEach(section => section.classList.remove('active'));
                    this.classList.add('selected');
                    document.getElementById(target).classList.add('active');
                    if (target === 'birthday-section' || target === 'username-section') {
                        root.style.height = '450px';
                    } else {
                        root.style.height = '607px';
                    }
                }
            }
        });
    });

    // Add event listeners for navigation buttons
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const nextSection = this.getAttribute('data-next');
            navItems.forEach(nav => nav.classList.remove('selected'));
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(`.nav-item[data-target="${nextSection}"]`).classList.add('selected');
            document.getElementById(nextSection).classList.add('active');
            if (nextSection === 'birthday-section' || nextSection === 'username-section') {
                root.style.height = '450px';
            } else {
                root.style.height = '607px';
            }
        });
    });

    // Toggle password visibility
    togglePassword.addEventListener('mousedown', function (e) {
        e.preventDefault(); // Prevent default action
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.src = type === 'password' ? '/img/hide.svg' : '/img/show.svg';
        passwordInput.focus(); // Keep input focused
    });

    toggleConfirmPassword.addEventListener('mousedown', function (e) {
        e.preventDefault(); // Prevent default action
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.src = type === 'password' ? '/img/hide.svg' : '/img/show.svg';
        confirmPasswordInput.focus(); // Keep input focused
    });

    // Ensure birthdayInput and birthdayGroup exist before adding event listeners
    if (birthdayInput && birthdayGroup) {
        birthdayInput.addEventListener('focus', function () {
            birthdayInput.style.display = 'none';
            birthdayGroup.style.display = 'flex';
        });

        birthdayInputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.nextElementSibling.style.visibility = 'hidden'; // Hide label
            });

            input.addEventListener('blur', function () {
                if (this.value === '') {
                    this.nextElementSibling.style.visibility = 'visible'; // Show label
                }
            });
        });
    } else {
        console.error('Birthday input or group not found');
    }

    // Prevent form submission on Enter key press
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    });

    // Add event listener for password section button
    if (passwordSectionButton) {
        passwordSectionButton.addEventListener('click', createAccount);
    } else {
        console.error('Password section button not found');
    }

    // in birthy secteion, when 2 numbers in date input are filled, focus on month input
    document.getElementById('day').addEventListener('input', function() {
        if (this.value.length === 2) {
            document.getElementById('month').focus();
        }
    });
    document.getElementById('month').addEventListener('input', function() {
        if (this.value.length === 2) {
            document.getElementById('year').focus();
        }
    });
    


    //add button enter to go to next section if the button is not disabled
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const currentSection = document.querySelector('.section.active');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex === 0 && !emailButton.disabled) {
                emailButton.click();
            } else if (currentIndex === 1 && !birthdayButton.disabled) {
                birthdayButton.click();
            } else if (currentIndex === 2 && !usernameButton.disabled) {
                usernameButton.click();
            } else if (currentIndex === 3 && !submitButton.disabled) {
                passwordSectionButton.click();
            }
        }
    });

    // Initial validation checks
    updateSubmitButtonState();
    validateEmail();
    validateBirthday();
    validateUsername();
});
