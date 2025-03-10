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
