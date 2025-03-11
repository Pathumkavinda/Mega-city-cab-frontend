/**
 * manage-drivers.js - JavaScript for Mega City Cab Manage Drivers page
 * Created on: Mar 11, 2025
 */

// Global variables
let drivers = [];
let users = [];
let cars = [];
let currentPage = 1;
const driversPerPage = 10;
let editMode = false;
let currentDriverId = 0;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api"; // Updated to match your endpoint
const DRIVERS_ENDPOINT = `${API_BASE_URL}/drivers`;
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManageDrivers();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Drivers page
 */
function initManageDrivers() {
    // Load admin info
    loadAdminInfo();
    
    // Load users for the dropdown
    loadUsersForDropdown();
    
    // Load drivers first (changed order)
    loadDrivers();
    
    // Load cars for the dropdown (now after drivers)
    loadCarsForDropdown();
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
    document.getElementById('driverForm').addEventListener('submit', handleFormSubmit);
    
    // Add new driver button
    document.getElementById('addNewBtn').addEventListener('click', showAddDriverForm);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Search input
    document.getElementById('searchDrivers').addEventListener('input', handleSearch);
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Delete driver confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteDriver);
    
    // Status change confirmation
    document.getElementById('confirmStatusBtn').addEventListener('click', confirmStatusChange);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
            });
        });
    });
}

/**
 * Load users for the dropdown selection
 */
function loadUsersForDropdown() {
    fetch(USERS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load users');
            }
            return response.json();
        })
        .then(data => {
            users = Array.isArray(data) ? data : [];
            populateUserDropdown();
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showAlert(`Error loading users: ${error.message}`, 'error');
        });
}

/**
 * Load cars for the dropdown selection
 */
function loadCarsForDropdown() {
    fetch(CARS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load cars');
            }
            return response.json();
        })
        .then(data => {
            cars = Array.isArray(data) ? data : [];
            // Call the improved function with current driver ID (if in edit mode)
            populateCarDropdown(editMode ? currentDriverId : 0);
            
            // Re-render the drivers table to ensure car details are displayed correctly
            renderDrivers();
        })
        .catch(error => {
            console.error('Error loading cars:', error);
            showAlert(`Error loading cars: ${error.message}`, 'error');
        });
}

/**
 * Populate user dropdown with available users who have the driver role
 */
function populateUserDropdown() {
    const userSelect = document.getElementById('userId');
    userSelect.innerHTML = '<option value="">Select User</option>';
    
    // Filter users to only include those with driver role
    const driverUsers = users.filter(user => user.uRole?.toLowerCase() === "driver");
    
    if (driverUsers.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = "No users with driver role available";
        userSelect.appendChild(option);
    } else {
        driverUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.fullName} (${user.username})`;
            userSelect.appendChild(option);
        });
    }
}

/**
 * Populate car dropdown with available cars that are not already assigned to active drivers
 * @param {number} currentDriverId - Optional ID of the current driver being edited
 */
function populateCarDropdown(currentDriverId = 0) {
    const carSelect = document.getElementById('carId');
    carSelect.innerHTML = '<option value="">Select Car</option>';
    
    // Debug: Log the cars data structure to help identify property names
    if (cars.length > 0) {
        console.log('Car data structure:', cars[0]);
    }
    
    // Create a set of car IDs that are already assigned to active drivers
    const assignedCarIds = new Set();
    drivers.forEach(driver => {
        // Skip the current driver being edited to allow keeping the same car
        if (driver.driver_id !== currentDriverId && driver.active_status === true) {
            assignedCarIds.add(driver.car_id);
        }
    });
    
    // Filter available cars (not assigned to any active driver)
    const availableCars = cars.filter(car => {
        // Check if either car.id or car.car_id is in assignedCarIds
        const carIdMatch = !assignedCarIds.has(car.id);
        const carCarIdMatch = !assignedCarIds.has(car.car_id);
        return carIdMatch && carCarIdMatch;
    });
    
    if (availableCars.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = "No available cars found";
        carSelect.appendChild(option);
    } else {
        availableCars.forEach(car => {
            const option = document.createElement('option');
            // Use car.id or car.car_id depending on which one exists
            option.value = car.id || car.car_id;
            option.textContent = `${car.number_plate} (${car.chassis_number || ''})`;
            carSelect.appendChild(option);
        });
    }
    
    // Add a note about car availability
    const helpText = document.createElement('div');
    helpText.className = 'form-text mt-1';
    helpText.innerHTML = `<small>Showing only available cars (${availableCars.length} of ${cars.length} total).</small>`;
    
    // Remove any existing help text before adding new one
    const existingHelpText = carSelect.parentNode.querySelector('.form-text');
    if (existingHelpText) {
        existingHelpText.remove();
    }
    
    carSelect.parentNode.appendChild(helpText);
}

/**
 * Load drivers from the API
 */
function loadDrivers() {
    // Show loading indicator
    const tableBody = document.getElementById('driversTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading drivers...
            </td>
        </tr>
    `;
    
    // Fetch drivers from API
    fetch(DRIVERS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load drivers');
            }
            return response.json();
        })
        .then(data => {
            drivers = Array.isArray(data) ? data : [];
            
            // Debug: Log the structure of the first driver to help identify property names
            if (drivers.length > 0) {
                console.log('Driver data structure:', drivers[0]);
            }
            
            renderDrivers();
            renderPagination();
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
            showAlert(`Error loading drivers: ${error.message}`, 'error');
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="6" class="error-message text-center">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load drivers. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Get user name by ID
 * @param {number} userId - User ID
 * @returns {string} - User name
 */
function getUserNameById(userId) {
    const user = users.find(u => u.id === userId);
    return user ? `${user.fullName} (${user.username})` : 'Unknown User';
}

/**
 * Get car details by ID
 * @param {number} carId - Car ID
 * @returns {string} - Car details
 */
function getCarDetailsById(carId) {
    // Try to find car by id first
    let car = cars.find(c => c.id === carId);
    
    // If not found, try to find by car_id if that's the property name in your data
    if (!car) {
        car = cars.find(c => c.car_id === carId);
    }
    
    // If still not found, try with string comparison (in case of type mismatch)
    if (!car) {
        car = cars.find(c => String(c.id) === String(carId) || String(c.car_id) === String(carId));
    }
    
    // Return car details if found, otherwise 'Unknown Car'
    return car ? `${car.number_plate} (${car.chassis_number || ''})` : 'Unknown Car';
}

/**
 * Render drivers in the table
 * @param {Array} filteredDrivers - Optional filtered list of drivers
 */
function renderDrivers(filteredDrivers = null) {
    const tableBody = document.getElementById('driversTable').getElementsByTagName('tbody')[0];
    const driversToRender = filteredDrivers || drivers;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are drivers to display
    if (!driversToRender || driversToRender.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="empty-message text-center">
                    <i class="fas fa-id-card"></i>
                    <p>No drivers found. Add a new driver to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = Math.min(startIndex + driversPerPage, driversToRender.length);
    const paginatedDrivers = driversToRender.slice(startIndex, endIndex);
    
    // Populate table
    paginatedDrivers.forEach(driver => {
        const row = document.createElement('tr');
        
        // Format status with appropriate styling
        const statusClass = driver.active_status ? 'active' : 'inactive';
        const statusDisplay = `<span class="status-badge ${statusClass}">${driver.active_status ? 'Active' : 'Inactive'}</span>`;
        
        // Get username and car details
        const userName = getUserNameById(driver.user_id);
        const carDetails = getCarDetailsById(driver.car_id);
        
        row.innerHTML = `
            <td>#${driver.driver_id}</td>
            <td>${userName}</td>
            <td>${carDetails}</td>
            <td>${driver.license_number || ''}</td>
            <td>${statusDisplay}</td>
            <td class="table-actions">
                <button class="action-btn view" onclick="viewDriver(${driver.driver_id})" title="View Driver">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editDriver(${driver.driver_id})" title="Edit Driver">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn toggle ${driver.active_status ? '' : 'inactive'}" 
                        onclick="toggleDriverStatus(${driver.driver_id}, ${!driver.active_status}, '${userName}')" 
                        title="${driver.active_status ? 'Deactivate' : 'Activate'} Driver">
                    <i class="fas ${driver.active_status ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                </button>
                <button class="action-btn delete" onclick="deleteDriver(${driver.driver_id}, '${userName}')" title="Delete Driver">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const pagination = document.getElementById('driversPagination');
    const totalPages = Math.ceil(drivers.length / driversPerPage);
    
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
            renderDrivers();
            renderPagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderDrivers();
            renderPagination();
        }
    });
    
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderDrivers();
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
        // Reset to show all drivers
        currentPage = 1;
        renderDrivers();
        renderPagination();
        return;
    }
    
    // Filter drivers based on search term
    // This is a simplistic approach - in a real app you'd want to search by user name as well
    const filteredDrivers = drivers.filter(driver => {
        const userName = getUserNameById(driver.user_id).toLowerCase();
        const carDetails = getCarDetailsById(driver.car_id).toLowerCase();
        
        return (
            userName.includes(searchTerm) ||
            carDetails.includes(searchTerm) ||
            (driver.license_number && driver.license_number.toLowerCase().includes(searchTerm))
        );
    });
    
    currentPage = 1;
    renderDrivers(filteredDrivers);
    renderPagination();
}

/**
 * Show form to add a new driver
 */
function showAddDriverForm() {
    editMode = false;
    currentDriverId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Driver';
    
    // Reset the form
    resetForm();
    
    // Refresh car dropdown to show only available cars
    populateCarDropdown(0);
    
    // Scroll to the form
    document.querySelector('.driver-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Edit an existing driver
 * @param {number} driverId - Driver ID to edit
 */
function editDriver(driverId) {
    // Find the driver in our data
    const driver = drivers.find(d => d.driver_id === driverId);
    
    if (!driver) {
        showAlert('Driver not found', 'error');
        return;
    }
    
    // Set edit mode
    editMode = true;
    currentDriverId = driverId;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit Driver';
    
    // Populate car dropdown with available cars + current car
    populateCarDropdown(driverId);
    
    // Populate the form with driver data
    document.getElementById('driverId').value = driver.driver_id;
    document.getElementById('userId').value = driver.user_id;
    document.getElementById('carId').value = driver.car_id;
    document.getElementById('licenseNumber').value = driver.license_number || '';
    document.getElementById('activeStatus').value = driver.active_status.toString();
    
    // Scroll to the form
    document.querySelector('.driver-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * View driver details
 * @param {number} driverId - Driver ID to view
 */
function viewDriver(driverId) {
    // Find the driver in our data
    const driver = drivers.find(d => d.driver_id === driverId);
    
    if (!driver) {
        showAlert('Driver not found', 'error');
        return;
    }
    
    // In a real application, you'd show a modal with all driver details
    // For now, we'll just use the edit form in read-only mode
    editDriver(driverId);
    
    // Make all fields read-only
    const form = document.getElementById('driverForm');
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
    document.getElementById('formTitle').textContent = 'Driver Details';
    
    // Add a note about user role if the user doesn't see their expected user in dropdown
    const helpText = document.querySelector('.form-help');
    if (helpText) {
        helpText.style.color = '#ff5722';
        helpText.innerHTML = '<strong>Note:</strong> Only users with the role "driver" are displayed here. To add more users, go to Manage Users and set their role to "driver".';
    }
}

/**
 * Toggle driver active status
 * @param {number} driverId - Driver ID
 * @param {boolean} newStatus - New status value
 * @param {string} driverName - Driver name for confirmation
 */
function toggleDriverStatus(driverId, newStatus, driverName) {
    // Set the driver information in the modal
    document.getElementById('statusDriverName').textContent = driverName;
    document.getElementById('newStatus').textContent = newStatus ? 'Active' : 'Inactive';
    
    // Store the info for the confirmation
    document.getElementById('confirmStatusBtn').setAttribute('data-driver-id', driverId);
    document.getElementById('confirmStatusBtn').setAttribute('data-status', newStatus);
    
    // Show the status confirmation modal
    document.getElementById('statusModal').classList.add('show');
}

/**
 * Confirm and execute driver status change
 */
function confirmStatusChange() {
    const driverId = parseInt(document.getElementById('confirmStatusBtn').getAttribute('data-driver-id'));
    const newStatus = document.getElementById('confirmStatusBtn').getAttribute('data-status') === 'true';
    
    // Hide the modal
    document.getElementById('statusModal').classList.remove('show');
    
    // Send status update request to API
    fetch(`${DRIVERS_ENDPOINT}/${driverId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active_status: newStatus })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update driver status');
        }
        return response.json();
    })
    .then(data => {
        // Update driver in our local data
        const driverIndex = drivers.findIndex(d => d.driver_id === driverId);
        if (driverIndex !== -1) {
            drivers[driverIndex].active_status = newStatus;
        }
        
        // Re-render the table
        renderDrivers();
        
        // If activating a driver, refresh the car dropdown to exclude their car
        if (newStatus) {
            populateCarDropdown(editMode ? currentDriverId : 0);
        }
        
        // Show success message
        showAlert(`Driver status updated to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
    })
    .catch(error => {
        console.error('Error updating driver status:', error);
        showAlert(`Error updating driver status: ${error.message}`, 'error');
    });
}

/**
 * Prepare to delete a driver
 * @param {number} driverId - Driver ID to delete
 * @param {string} driverName - Driver name for confirmation
 */
function deleteDriver(driverId, driverName) {
    // Set the driver information in the modal
    document.getElementById('deleteDriverName').textContent = driverName || `ID: ${driverId}`;
    
    // Store the driver ID for the confirmation
    document.getElementById('confirmDeleteBtn').setAttribute('data-driver-id', driverId);
    
    // Show the delete confirmation modal
    document.getElementById('deleteModal').classList.add('show');
}

/**
 * Confirm and execute driver deletion
 */
function confirmDeleteDriver() {
    const driverId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-driver-id'));
    
    // Hide the modal
    document.getElementById('deleteModal').classList.remove('show');
    
    // Send delete request to API
    fetch(`${DRIVERS_ENDPOINT}/${driverId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete driver');
        }
        return response.json();
    })
    .then(data => {
        // Remove driver from our local data
        drivers = drivers.filter(driver => driver.driver_id !== driverId);
        
        // Re-render the table
        renderDrivers();
        renderPagination();
        
        // Refresh car dropdown as a car may now be available
        populateCarDropdown(editMode ? currentDriverId : 0);
        
        // Show success message
        showAlert('Driver deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting driver:', error);
        showAlert(`Error deleting driver: ${error.message}`, 'error');
    });
}

/**
 * Validate form before submission
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    // Get form elements
    const form = document.getElementById('driverForm');
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Validate required fields
    let isValid = true;
    
    // Check if user is selected
    const userId = document.getElementById('userId').value;
    if (!userId) {
        isValid = false;
        const userGroup = document.getElementById('userId').closest('.form-group');
        userGroup.classList.add('error');
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please select a user';
        userGroup.appendChild(errorMsg);
    }
    
    // Check if car is selected
    const carId = document.getElementById('carId').value;
    if (!carId) {
        isValid = false;
        const carGroup = document.getElementById('carId').closest('.form-group');
        carGroup.classList.add('error');
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please select a car';
        carGroup.appendChild(errorMsg);
    }
    
    // Check if license number is provided
    const licenseNumber = document.getElementById('licenseNumber').value.trim();
    if (!licenseNumber) {
        isValid = false;
        const licenseGroup = document.getElementById('licenseNumber').closest('.form-group');
        licenseGroup.classList.add('error');
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'License number is required';
        licenseGroup.appendChild(errorMsg);
    }
    
    return isValid;
}

/**
 * Reset the driver form
 */
function resetForm() {
    // Reset form fields
    document.getElementById('driverForm').reset();
    document.getElementById('driverId').value = "0";
    
    // Clear validation errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Reset form state
    editMode = false;
    currentDriverId = 0;
    
    // Show form actions if they were hidden
    document.querySelector('.form-actions').style.display = 'flex';
    
    // Make fields editable if they were readonly
    const form = document.getElementById('driverForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        if (input.tagName === 'SELECT') {
            input.removeAttribute('disabled');
        }
    });
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Driver';
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning)
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
    const alert = btn.closest('.alert');
    alert.style.display = 'none';
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
 * Handle form submission (create or update driver)
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
    const driverData = {
        driver_id: parseInt(formData.get('driver_id')) || 0,
        user_id: parseInt(formData.get('user_id')),
        car_id: parseInt(formData.get('car_id')),
        license_number: formData.get('license_number'),
        active_status: formData.get('active_status') === 'true'
    };
    
    // Determine if this is a create or update operation
    const isUpdate = editMode && currentDriverId > 0;
    
    // API endpoint and method
    const url = isUpdate ? `${DRIVERS_ENDPOINT}/${currentDriverId}` : `${DRIVERS_ENDPOINT}/create`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(driverData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} driver`);
        }
        return response.json();
    })
    .then(data => {
        // Refresh the drivers list
        loadDrivers();
        
        // Reset the form
        resetForm();
        
        // Show success message
        showAlert(`Driver ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
    })
    .catch(error => {
        console.error(`Error ${isUpdate ? 'updating' : 'creating'} driver:`, error);
        showAlert(`Error ${isUpdate ? 'updating' : 'creating'} driver: ${error.message}`, 'error');
    });
}