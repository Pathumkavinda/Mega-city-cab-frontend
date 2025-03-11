/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * driver-user-integration.js - Integration between User and Driver management
 * Created on: Mar 10, 2025
 */

// This file should be included in both ManageUsers.jsp and ManageDrivers.jsp

// Constants
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const DRIVERS_ENDPOINT = `${API_BASE_URL}/drivers`;
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;

/**
 * Load available cars for driver assignment
 * @returns {Promise<void>}
 */
async function loadAvailableCars() {
    try {
        // Get the car select element
        const carSelect = document.getElementById('carSelect');
        if (!carSelect) return;
        
        // Show loading option
        carSelect.innerHTML = '<option value="">Loading cars...</option>';
        
        // Fetch available cars from the API
        const response = await fetch(`${API_BASE_URL}/cars?available=true`);
        if (!response.ok) {
            throw new Error('Failed to fetch cars');
        }
        
        const cars = await response.json();
        
        // Reset the select
        carSelect.innerHTML = '<option value="">Select a car</option>';
        
        // Add cars to select
        cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.number_plate} - ${car.category_name}`;
            carSelect.appendChild(option);
        });
        
        // Show message if no cars available
        if (cars.length === 0) {
            carSelect.innerHTML = '<option value="">No available cars found</option>';
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        
        // Show error in select
        const carSelect = document.getElementById('carSelect');
        if (carSelect) {
            carSelect.innerHTML = '<option value="">Error loading cars</option>';
        }
    }
}

/**
 * Assign car to driver
 * @param {number} driverId - Driver ID
 * @param {number} carId - Car ID
 * @returns {Promise<boolean>} - Success status
 */
async function assignCarToDriver(driverId, carId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cars/${carId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ driver_id: driverId }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to assign car');
        }
        
        return true;
    } catch (error) {
        console.error('Error assigning car:', error);
        if (typeof showAlert === 'function') {
            showAlert('Failed to assign car: ' + error.message, 'error');
        }
        return false;
    }
}

// Add DOM event listeners for the car assignment modal
document.addEventListener('DOMContentLoaded', function() {
    // Only run this if we're on the ManageDrivers.jsp page
    if (window.location.href.includes('ManageDrivers.jsp')) {
        // Handle open car assignment modal
        const assignCarBtns = document.querySelectorAll('.assign-car-btn');
        assignCarBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const driverId = this.getAttribute('data-driver-id');
                const driverName = this.getAttribute('data-driver-name');
                
                // Set driver info in modal
                document.getElementById('assignDriverName').textContent = driverName;
                
                // Store driver ID for assignment
                const confirmBtn = document.getElementById('confirmAssignBtn');
                confirmBtn.setAttribute('data-driver-id', driverId);
                
                // Load available cars
                loadAvailableCars();
                
                // Show modal
                document.getElementById('assignCarModal').classList.add('show');
            });
        });
        
        // Handle car assignment confirmation
        const confirmAssignBtn = document.getElementById('confirmAssignBtn');
        if (confirmAssignBtn) {
            confirmAssignBtn.addEventListener('click', async function() {
                const driverId = this.getAttribute('data-driver-id');
                const carId = document.getElementById('carSelect').value;
                
                if (!carId) {
                    if (typeof showAlert === 'function') {
                        showAlert('Please select a car to assign', 'warning');
                    }
                    return;
                }
                
                const success = await assignCarToDriver(driverId, parseInt(carId));
                
                if (success) {
                    // Close modal
                    document.getElementById('assignCarModal').classList.remove('show');
                    
                    // Show success message
                    if (typeof showAlert === 'function') {
                        showAlert('Car assigned successfully', 'success');
                    }
                    
                    // Refresh driver list
                    loadDrivers();
                }
            });
        }
        
        // Handle modal close buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Find parent modal
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
});
/**
 * Check if a user is already registered as a driver
 * @param {number} userId - User ID to check
 * @returns {Promise<boolean>} - True if already a driver, false otherwise
 */
async function isUserAlreadyDriver(userId) {
    try {
        const response = await fetch(`${DRIVERS_ENDPOINT}/user/${userId}`);
        return response.ok; // If ok (200), user is a driver
    } catch (error) {
        console.error('Error checking driver status:', error);
        return false;
    }
}

/**
 * Get user details by ID
 * @param {number} userId - User ID to fetch
 * @returns {Promise<Object>} - User data or null
 */
async function getUserById(userId) {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

/**
 * Create driver record for an existing user
 * @param {Object} driverData - Driver data including user_id
 * @returns {Promise<Object>} - Result of the operation
 */
async function createDriverForUser(driverData) {
    try {
        const response = await fetch(`${DRIVERS_ENDPOINT}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(driverData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create driver');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating driver:', error);
        throw error;
    }
}

/**
 * Update user role to 'driver'
 * @param {number} userId - User ID to update
 * @returns {Promise<boolean>} - Success status
 */
async function updateUserToDriverRole(userId) {
    try {
        // First get the current user data
        const userData = await getUserById(userId);
        if (!userData) {
            throw new Error('User not found');
        }
        
        // Update the role
        userData.uRole = 'driver';
        
        // Send update request
        const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user role');
        }
        
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
}

/**
 * Initialize driver form with user data
 * Useful when creating a driver from user management
 */
function initDriverFormWithUserData() {
    // Check if there's a selected driver user ID in session storage
    const selectedUserId = sessionStorage.getItem('selectedDriverUserId');
    if (selectedUserId) {
        // Clear it from session storage
        sessionStorage.removeItem('selectedDriverUserId');
        
        // Fetch the user data and populate the driver form
        getUserById(parseInt(selectedUserId))
            .then(userData => {
                if (userData) {
                    // Set the user ID in the driver form
                    if (document.getElementById('userId')) {
                        document.getElementById('userId').value = userData.id;
                    }
                    
                    // Trigger user selection change to display user info
                    if (document.getElementById('userId')) {
                        const event = new Event('change');
                        document.getElementById('userId').dispatchEvent(event);
                    }
                    
                    // Display user info in the form
                    if (document.getElementById('userFullName')) {
                        document.getElementById('userFullName').textContent = userData.fullName;
                    }
                    
                    if (document.getElementById('userEmail')) {
                        document.getElementById('userEmail').textContent = userData.uEmail;
                    }
                    
                    // Show selected user info
                    if (document.getElementById('selectedUserInfo')) {
                        document.getElementById('selectedUserInfo').style.display = 'block';
                    }
                    
                    // Scroll to the form
                    if (document.querySelector('.driver-form')) {
                        document.querySelector('.driver-form').scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    // Show a message
                    if (typeof showAlert === 'function') {
                        showAlert('User loaded. Complete the driver details below.', 'info');
                    }
                }
            })
            .catch(error => {
                console.error('Error initializing driver form:', error);
                if (typeof showAlert === 'function') {
                    showAlert('Error loading user data. Please try again.', 'error');
                }
            });
    }
}

// If we're on the drivers page, initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // Only run this if we're on the ManageDrivers.jsp page
    if (window.location.href.includes('ManageDrivers.jsp')) {
        initDriverFormWithUserData();
    }
});
/**
 * Load all users and populate the user selection dropdown
 * @returns {Promise<void>}
 */
async function loadUsersForDriverSelection() {
    try {
        // Show loading indicator
        const userSelect = document.getElementById('userId');
        if (!userSelect) return;
        
        userSelect.innerHTML = '<option value="">Loading users...</option>';
        
        // Fetch all users from the API
        const response = await fetch(`${USERS_ENDPOINT}`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        
        // Reset the select
        userSelect.innerHTML = '<option value="">Select User</option>';
        
        // Process each user
        const processUserPromises = users.map(async (user) => {
            try {
                // Check if user is already a driver
                const driverResponse = await fetch(`${DRIVERS_ENDPOINT}/user/${user.id}`);
                const isDriver = driverResponse.ok;
                
                // Skip users who are already drivers
                if (isDriver) return;
                
                // Skip users who don't have 'user' role
                if (user.uRole !== 'user') return;
                
                // Create and append the option
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.fullName} (${user.uEmail})`;
                userSelect.appendChild(option);
            } catch (error) {
                console.error(`Error processing user ${user.id}:`, error);
            }
        });
        
        // Wait for all user checks to complete
        await Promise.all(processUserPromises);
        
        // If no users available, show message
        if (userSelect.options.length <= 1) {
            userSelect.innerHTML = '<option value="">No available users found</option>';
        }
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('User list refreshed successfully', 'success');
        }
        
    } catch (error) {
        console.error('Error loading users:', error);
        
        // Show error message in the select
        const userSelect = document.getElementById('userId');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">Error loading users</option>';
        }
        
        // Show error alert
        if (typeof showAlert === 'function') {
            showAlert('Failed to load users. Please try again.', 'error');
        }
    }
}

// Attach event to refresh button
document.addEventListener('DOMContentLoaded', function() {
    // Only run this if we're on the ManageDrivers.jsp page
    if (window.location.href.includes('ManageDrivers.jsp')) {
        // Initial load of users
        loadUsersForDriverSelection();
        
        // Attach event to refresh button
        const refreshBtn = document.getElementById('refreshUsersBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loadUsersForDriverSelection();
            });
        }
        
        // Handle user selection change
        const userSelect = document.getElementById('userId');
        if (userSelect) {
            userSelect.addEventListener('change', async function() {
                const selectedUserId = this.value;
                const userInfoContainer = document.getElementById('selectedUserInfo');
                
                if (!selectedUserId) {
                    if (userInfoContainer) {
                        userInfoContainer.style.display = 'none';
                    }
                    return;
                }
                
                try {
                    const userData = await getUserById(parseInt(selectedUserId));
                    if (userData) {
                        // Display user info
                        if (document.getElementById('userFullName')) {
                            document.getElementById('userFullName').textContent = userData.fullName;
                        }
                        
                        if (document.getElementById('userEmail')) {
                            document.getElementById('userEmail').textContent = userData.uEmail;
                        }
                        
                        if (userInfoContainer) {
                            userInfoContainer.style.display = 'block';
                        }
                    }
                } catch (error) {
                    console.error('Error getting user details:', error);
                    if (typeof showAlert === 'function') {
                        showAlert('Error loading user details', 'error');
                    }
                }
            });
        }
    }
});
