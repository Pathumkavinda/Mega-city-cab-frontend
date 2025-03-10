/**
 * manage-users.js - JavaScript for Mega City Cab Manage Users page
 * Created on: Mar 9, 2025
 */

// Global variables
let users = [];
let currentPage = 1;
const usersPerPage = 10;
let editMode = false;
let currentUserId = 0;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api"; // Updated to match your endpoint
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const DRIVERS_ENDPOINT = `${API_BASE_URL}/drivers`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManageUsers();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Users page
 */
function initManageUsers() {
    // Load admin info
    loadAdminInfo();
    
    // Load users
    loadUsers();
}

/**
 * Load admin information
 */
function loadAdminInfo() {
    // This would typically come from a session/API
    const adminName = "Admin User"; // Replace with actual admin name
    const initials = getInitials(adminName);
    
    // Update admin info in the UI
    document.getElementById('adminName').textContent = adminName;
    document.getElementById('userInitials').textContent = initials;
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Form submission
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
    
    // Add new user button
    document.getElementById('addNewBtn').addEventListener('click', showAddUserForm);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Search input
    document.getElementById('searchUsers').addEventListener('input', handleSearch);
    
    // Role selection change - NEW
    if (document.getElementById('uRole')) {
        document.getElementById('uRole').addEventListener('change', handleRoleChange);
    }
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Delete user confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteUser);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('deleteModal').classList.remove('show');
        });
    });
}

/**
 * Handle role selection change - NEW
 */
function handleRoleChange() {
    const roleSelect = document.getElementById('uRole');
    const selectedRole = roleSelect.value;
    
    if (selectedRole === 'driver') {
        // Show driver role information
        showAlert('Users with the Driver role will need additional information in the Drivers section.', 'info');
        
        // Ensure required driver fields are filled
        const nicField = document.getElementById('nic_number');
        const phoneField = document.getElementById('phone');
        
        if (!nicField.value) {
            nicField.focus();
        } else if (!phoneField.value) {
            phoneField.focus();
        }
    }
}

/**
 * Load users from the API
 */
function loadUsers() {
    // Show loading indicator
    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="7" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading users...
            </td>
        </tr>
    `;
    
    // Debug log
    console.log("Fetching users from:", USERS_ENDPOINT);
    
    // Fetch users from API
    fetch(USERS_ENDPOINT)
        .then(response => {
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                throw new Error('Failed to load users');
            }
            return response.json();
        })
        .then(data => {
            console.log("Users data received:", data);
            users = Array.isArray(data) ? data : [];
            renderUsers();
            renderPagination();
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showAlert(`Error loading users: ${error.message}`, 'error');
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="7" class="error-message text-center">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load users. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Render users in the table
 * @param {Array} filteredUsers - Optional filtered list of users
 */
function renderUsers(filteredUsers = null) {
    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    const usersToRender = filteredUsers || users;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are users to display
    if (!usersToRender || usersToRender.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7" class="empty-message text-center">
                    <i class="fas fa-users"></i>
                    <p>No users found. Add a new user to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, usersToRender.length);
    const paginatedUsers = usersToRender.slice(startIndex, endIndex);
    
    // Populate table
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Format user role with appropriate styling
        const roleClass = user.uRole ? user.uRole.toLowerCase() : 'user';
        const roleDisplay = `<span class="user-role ${roleClass}">${user.uRole || 'User'}</span>`;
        
        // Create action buttons
        let actionButtons = `
            <button class="action-btn view" onclick="viewUser(${user.id})" title="View User">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit User">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteUser(${user.id}, '${user.fullName}')" title="Delete User">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        // Add driver-specific button if role is driver
        if (user.uRole === 'driver') {
            actionButtons += `
                <button class="action-btn driver" onclick="manageDriverDetails(${user.id})" title="Manage Driver Details">
                    <i class="fas fa-id-card"></i>
                </button>
            `;
        }
        
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.fullName || ''}</td>
            <td>${user.username || ''}</td>
            <td>${user.uEmail || ''}</td>
            <td>${user.phone || ''}</td>
            <td>${roleDisplay}</td>
            <td class="table-actions">
                ${actionButtons}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Check if a user is already registered as a driver - NEW
 * @param {number} userId - User ID to check
 * @returns {Promise<boolean>} - True if already a driver, false otherwise
 */
async function isUserAlreadyDriver(userId) {
    try {
        const response = await fetch(`${DRIVERS_ENDPOINT}/user/${userId}`);
        return response.ok; // If 200 OK, user is a driver
    } catch (error) {
        console.error('Error checking driver status:', error);
        return false;
    }
}

/**
 * Navigate to driver management for a specific user - NEW
 * @param {number} userId - User ID to manage as driver
 */
function manageDriverDetails(userId) {
    // Store the user ID in session storage to access it in the drivers page
    sessionStorage.setItem('selectedDriverUserId', userId);
    // Navigate to the driver management page
    window.location.href = 'ManageDrivers.jsp';
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const pagination = document.getElementById('usersPagination');
    const totalPages = Math.ceil(users.length / usersPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Show max 5 page buttons
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    paginationHTML += `
        <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners for pagination controls
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
            renderPagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderUsers();
            renderPagination();
        }
    });
    
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderUsers();
            renderPagination();
        });
    });
}

/**
 * Handle search functionality
 */
function handleSearch(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        // Reset to show all users
        currentPage = 1;
        renderUsers();
        renderPagination();
        return;
    }
    
    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        return (
            (user.fullName && user.fullName.toLowerCase().includes(searchTerm)) ||
            (user.username && user.username.toLowerCase().includes(searchTerm)) ||
            (user.uEmail && user.uEmail.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.includes(searchTerm))
        );
    });
    
    currentPage = 1;
    renderUsers(filteredUsers);
    renderPagination();
}

/**
 * Show form to add a new user
 */
function showAddUserForm() {
    editMode = false;
    currentUserId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New User';
    
    // Reset the form
    resetForm();
    
    // Show password fields (required for new users)
    document.getElementById('passwordFields').style.display = 'flex';
    document.getElementById('pWord').required = true;
    document.getElementById('confirmPassword').required = true;
    
    // Scroll to the form
    document.querySelector('.user-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Edit an existing user
 * @param {number} userId - User ID to edit
 */
function editUser(userId) {
    // Find the user in our data
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showAlert('User not found', 'error');
        return;
    }
    
    // Set edit mode
    editMode = true;
    currentUserId = userId;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit User';
    
    // Populate the form with user data
    document.getElementById('userId').value = user.id;
    document.getElementById('username').value = user.username || '';
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('uEmail').value = user.uEmail || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('nic_number').value = user.nic_number || '';
    document.getElementById('uRole').value = user.uRole || '';
    document.getElementById('address').value = user.address || '';
    
    // Password fields are optional when editing
    document.getElementById('passwordFields').style.display = 'flex';
    document.getElementById('pWord').required = false;
    document.getElementById('confirmPassword').required = false;
    document.getElementById('pWord').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Scroll to the form
    document.querySelector('.user-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * View user details
 * @param {number} userId - User ID to view
 */
function viewUser(userId) {
    // Find the user in our data
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showAlert('User not found', 'error');
        return;
    }
    
    // In a real application, you'd show a modal with all user details
    // For now, we'll just use the edit form in read-only mode
    editUser(userId);
    
    // Make all fields read-only
    const form = document.getElementById('userForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        if (input.tagName === 'SELECT') {
            input.setAttribute('disabled', true);
        }
    });
    
    // Hide action buttons
    document.querySelector('.form-actions').style.display = 'none';
    
    // Update form title
    document.getElementById('formTitle').textContent = 'User Details';
}

/**
 * Prepare to delete a user
 * @param {number} userId - User ID to delete
 * @param {string} userName - User name for confirmation
 */
function deleteUser(userId, userName) {
    // Set the user information in the modal
    document.getElementById('deleteUserName').textContent = userName || `ID: ${userId}`;
    
    // Store the user ID for the confirmation
    document.getElementById('confirmDeleteBtn').setAttribute('data-user-id', userId);
    
    // Show the delete confirmation modal
    document.getElementById('deleteModal').classList.add('show');
}

/**
 * Confirm and execute user deletion
 */
function confirmDeleteUser() {
    const userId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-user-id'));
    
    // Hide the modal
    document.getElementById('deleteModal').classList.remove('show');
    
    // Send delete request to API
    fetch(`${USERS_ENDPOINT}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return response.json();
    })
    .then(data => {
        // Remove user from our local data
        users = users.filter(user => user.id !== userId);
        
        // Re-render the table
        renderUsers();
        renderPagination();
        
        // Show success message
        showAlert('User deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        showAlert(`Error deleting user: ${error.message}`, 'error');
    });
}

/**
 * Validate form before submission
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    // Get form elements
    const form = document.getElementById('userForm');
    const password = document.getElementById('pWord').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const roleSelect = document.getElementById('uRole');
    const selectedRole = roleSelect ? roleSelect.value : '';
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Validate required fields
    let isValid = true;
    
    // Check if passwords match (if password is provided)
    if (password || confirmPassword) {
        if (password !== confirmPassword) {
            isValid = false;
            
            // Add error to both password fields
            const passwordGroup = document.getElementById('pWord').closest('.form-group');
            const confirmGroup = document.getElementById('confirmPassword').closest('.form-group');
            
            passwordGroup.classList.add('error');
            confirmGroup.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Passwords do not match';
            confirmGroup.appendChild(errorMsg);
        }
    }
    
    // Check if a new user has a password
    if (!editMode && !password) {
        isValid = false;
        
        // Add error to password field
        const passwordGroup = document.getElementById('pWord').closest('.form-group');
        passwordGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Password is required for new users';
        passwordGroup.appendChild(errorMsg);
    }
    
    // Validate driver-specific fields - NEW
    if (selectedRole === 'driver') {
        const phone = document.getElementById('phone').value.trim();
        const nicNumber = document.getElementById('nic_number').value.trim();
        
        if (!phone) {
            isValid = false;
            // Add error to phone field
            const phoneGroup = document.getElementById('phone').closest('.form-group');
            phoneGroup.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Phone number is required for drivers';
            phoneGroup.appendChild(errorMsg);
        }
        
        if (!nicNumber) {
            isValid = false;
            // Add error to NIC field
            const nicGroup = document.getElementById('nic_number').closest('.form-group');
            nicGroup.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'NIC number is required for drivers';
            nicGroup.appendChild(errorMsg);
        }
    }
    
    return isValid;
}

/**
 * Reset the user form
 */
function resetForm() {
    // Reset form fields
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = "0";
    
    // Clear validation errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Reset form state
    editMode = false;
    currentUserId = 0;
    
    // Show form actions if they were hidden
    document.querySelector('.form-actions').style.display = 'flex';
    
    // Make fields editable if they were readonly
    const form = document.getElementById('userForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        if (input.tagName === 'SELECT') {
            input.removeAttribute('disabled');
        }
    });
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New User';
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning, info)
 */
function showAlert(message, type = 'success') {
    const flashMessage = document.getElementById('flashMessage');
    const flashMessageText = document.getElementById('flashMessageText');
    
    // Set message and type
    flashMessageText.textContent = message;
    
    // Set appropriate class based on type
    flashMessage.className = 'alert';
    flashMessage.classList.add(`alert-${type}`);
    
    // Show the message
    flashMessage.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeAlert(document.querySelector('.alert-close'));
    }, 5000);
}

/**
 * Close alert message
 * @param {HTMLElement} btn - Close button element
 */
function closeAlert(btn) {
    if (!btn) return;
    const alert = btn.closest('.alert');
    if (alert) {
        alert.style.display = 'none';
    }
}

/**
 * Handle logout functionality
 */
function handleLogout() {
    // In a real application, this would send a request to invalidate the session
    // For now, just redirect to the login page
    window.location.href = '../index.jsp';
}

/**
 * Handle form submission (create or update user)
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const userData = {
        id: parseInt(formData.get('id')) || 0,
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        uEmail: formData.get('uEmail'),
        phone: formData.get('phone'),
        nic_number: formData.get('nic_number'),
        uRole: formData.get('uRole'),
        address: formData.get('address')
    };
    
    // Add password if provided (or if it's a new user)
    const password = formData.get('pWord');
    if (password) {
        userData.pWord = password;
    }
    
    // Store the previous role if editing
    let previousRole = null;
    if (editMode) {
        const user = users.find(u => u.id === currentUserId);
        if (user) {
            previousRole = user.uRole;
        }
    }
    
    // Determine if this is a create or update operation
    const isUpdate = editMode && currentUserId > 0;
    
    // API endpoint and method
    const url = isUpdate ? `${USERS_ENDPOINT}/${currentUserId}` : `${USERS_ENDPOINT}/create`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} user`);
        }
        return response.json();
    })
    .then(data => {
        // Check if role changed to driver
        if (userData.uRole === 'driver' && previousRole !== 'driver') {
            showAlert(`User ${isUpdate ? 'updated' : 'created'} successfully with Driver role. Please complete driver details in the Drivers section.`, 'info');
            
            // Store the user ID in session storage to create a driver record
            if (isUpdate) {
                sessionStorage.setItem('selectedDriverUserId', currentUserId);
            } else if (data.userId) {
                sessionStorage.setItem('selectedDriverUserId', data.userId);
            }
            
            // Ask if they want to go to driver management
            if (confirm('Would you like to set up driver details now?')) {
                window.location.href = 'ManageDrivers.jsp';
                return;
            }
        } else {
            // Show standard success message
            showAlert(`User ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
        }
        
        // Refresh the users list
        loadUsers();
        
        // Reset the form
        resetForm();
    })
    .catch(error => {
        console.error(`Error ${isUpdate ? 'updating' : 'creating'} user:`, error);
        showAlert(`Error ${isUpdate ? 'updating' : 'creating'} user: ${error.message}`, 'error');
    });
}