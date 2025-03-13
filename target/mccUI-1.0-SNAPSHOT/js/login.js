/**
 * MegacityCabs - Login Module
 * Handles user authentication and session management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    initializeUI();
    
    // Check if user is already logged in
    checkExistingSession();
    
    // Set up form submission handler
    setupLoginForm();
    
    // Set up registration link if present
    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.jsp';
        });
    }
});

/**
 * Initialize UI elements and animations
 */
function initializeUI() {
    // Add any UI initialization code here
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.classList.add('fade-in');
    }
    
    // Setup password visibility toggle if present
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

/**
 * Check if user already has an active session
 */
function checkExistingSession() {
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (userId && userRole && loginTime) {
        // Check if session is not expired (optional: 24 hour expiry)
        const now = new Date();
        const loginTimeDate = new Date(loginTime);
        const hoursSinceLogin = (now - loginTimeDate) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
            console.log('Active session found, redirecting to dashboard');
            redirectToDashboard(userRole);
            return;
        } else {
            // Clear expired session
            console.log('Session expired, clearing session data');
            sessionStorage.clear();
        }
    }
}

/**
 * Set up the login form submission handler
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me')?.checked;
        
        // Clear previous error messages
        clearErrors();
        
        // Validate form
        if (!validateForm(email, password)) {
            return;
        }
        
        // Prepare data for API
        const userData = {
            uEmail: email,
            pWord: password
        };
        
        // Update UI to loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true);
        
        // Call the login API
        loginUser(userData)
            .then(data => {
                processLoginResponse(data, email, rememberMe);
            })
            .catch(error => {
                showError(error.message);
                setLoadingState(submitBtn, false);
            });
    });
}

/**
 * Validate the login form
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} - True if validation passes
 */
function validateForm(email, password) {
    // Check if fields are empty
    if (!email || !password) {
        showError('Please fill in all fields.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return false;
    }
    
    // Password minimum length
    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return false;
    }
    
    return true;
}

/**
 * Call the login API
 * @param {Object} userData - User credentials
 * @returns {Promise} - Promise resolving to user data
 */
function loginUser(userData) {
    return fetch('http://localhost:8080/mccAPI/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid email or password.');
            } else if (response.status === 403) {
                throw new Error('Your account has been locked. Please contact support.');
            } else if (response.status === 429) {
                throw new Error('Too many login attempts. Please try again later.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
            throw new Error('Login failed. Please try again.');
        }
        return response.json();
    })
    .catch(error => {
        // Handle network errors
        if (error.name === 'TypeError') {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    });
}

/**
 * Process the login API response
 * @param {Object} data - User data from API
 * @param {string} email - User email
 * @param {boolean} rememberMe - Whether to remember login
 */
function processLoginResponse(data, email, rememberMe) {
    console.log('Login successful:', data);
    
    // Store user information in session storage
    storeUserSession(data, email, rememberMe);
    
    // Redirect user to appropriate dashboard
    redirectToDashboard(data.uRole);
}

/**
 * Store user session data
 * @param {Object} data - User data from API
 * @param {string} email - User email
 * @param {boolean} rememberMe - Whether to remember login
 */
function storeUserSession(data, email, rememberMe) {
    // Basic user information
    sessionStorage.setItem('userId', data.userId);
    sessionStorage.setItem('userRole', data.uRole);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('loginTime', new Date().toISOString());
    
    // User display name (try different possible fields)
    if (data.fullName) {
        sessionStorage.setItem('userName', data.fullName);
    } else if (data.name) {
        sessionStorage.setItem('userName', data.name);
    } else if (data.username) {
        sessionStorage.setItem('userName', data.username);
    } else if (data.firstName && data.lastName) {
        sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
    } else {
        // Fallback to email username part if no name available
        sessionStorage.setItem('userName', email.split('@')[0]);
    }
    
    // Additional user details if available
    if (data.phone) sessionStorage.setItem('userPhone', data.phone);
    if (data.profilePicture) sessionStorage.setItem('userProfilePic', data.profilePicture);
    
    // Store complete user data object
    sessionStorage.setItem('userData', JSON.stringify(data));
    
    // Handle remember me functionality (using localStorage for persistence)
    if (rememberMe) {
        localStorage.setItem('rememberedUser', email);
    } else {
        localStorage.removeItem('rememberedUser');
    }
}

/**
 * Redirect to role-specific dashboard
 * @param {string} role - User role
 */
function redirectToDashboard(role) {
    switch(role.toLowerCase()) {
        case 'admin':
            window.location.href = 'admin/adminDash.jsp';
            break;
        case 'user':
            window.location.href = 'customer/customerDash.jsp';
            break;
        case 'driver':
            window.location.href = 'driver/driverDash.jsp';
            break;
        default:
            showError('Invalid user role. Please contact support.');
            console.error('Unknown user role:', role);
    }
}

/**
 * Set loading state for submit button
 * @param {HTMLElement} button - Submit button element
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(button, isLoading) {
    if (!button) return;
    
    const originalText = button.getAttribute('data-original-text') || button.innerHTML;
    
    if (isLoading) {
        // Save original text if not saved already
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', originalText);
        }
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
        button.disabled = true;
    } else {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('Error message element not found');
        alert(message);
        return;
    }
    
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Add error shake animation
    errorMessage.classList.add('error-shake');
    setTimeout(() => {
        errorMessage.classList.remove('error-shake');
    }, 500);
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
    }
}