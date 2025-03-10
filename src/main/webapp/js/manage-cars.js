/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/**
 * manage-cars.js - JavaScript for Mega City Cab Manage Cars page
 * Created on: Mar 9, 2025
 * Updated on: Mar 10, 2025
 */

// Global variables
let cars = [];
let categories = [];
let currentPage = 1;
const carsPerPage = 10;
let editMode = false;
let currentCarId = 0;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManageCars();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Cars page
 */
function initManageCars() {
    // Load admin info
    loadAdminInfo();
    
    // Load categories for dropdowns
    loadCategories();
    
    // Load cars
    loadCars();
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
    document.getElementById('carForm').addEventListener('submit', handleFormSubmit);
    
    // Add new car button
    document.getElementById('addNewBtn').addEventListener('click', showAddCarForm);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Delete car confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteCar);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('deleteModal').classList.remove('show');
        });
    });
}

/**
 * Load categories from API
 */
function loadCategories() {
    fetch(CATEGORIES_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load categories');
            }
            return response.json();
        })
        .then(data => {
            categories = Array.isArray(data) ? data : [];
            populateCategoryDropdowns();
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            showAlert(`Error loading categories: ${error.message}`, 'error');
        });
}

/**
 * Populate category dropdowns
 */
function populateCategoryDropdowns() {
    // Category dropdown for form
    const categorySelect = document.getElementById('categoryId');
    
    // Clear existing options (except the first placeholder)
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Add category options
    categories.forEach(category => {
        if (category.is_available) { // Only show available categories
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        }
    });
    
    // Category filter dropdown
    const filterCategorySelect = document.getElementById('filterCategory');
    
    // Clear existing options (except the first "All Categories")
    while (filterCategorySelect.options.length > 1) {
        filterCategorySelect.remove(1);
    }
    
    // Get unique category names
    const uniqueCategories = [...new Set(categories.map(cat => cat.category_name))];
    
    // Add category options to filter dropdown
    uniqueCategories.forEach(categoryName => {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        filterCategorySelect.appendChild(option);
    });
}

/**
 * Load cars from the API
 */
function loadCars() {
    // Show loading indicator
    const tableBody = document.getElementById('carsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading cars...
            </td>
        </tr>
    `;
    
    // Fetch cars from API
    fetch(CARS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load cars');
            }
            return response.json();
        })
        .then(data => {
            cars = Array.isArray(data) ? data : [];
            renderCars();
            renderPagination();
        })
        .catch(error => {
            console.error('Error loading cars:', error);
            showAlert(`Error loading cars: ${error.message}`, 'error');
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="6" class="error-message text-center">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load cars. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Render cars in the table
 * @param {Array} filteredCars - Optional filtered list of cars
 */
function renderCars(filteredCars = null) {
    const tableBody = document.getElementById('carsTable').getElementsByTagName('tbody')[0];
    const carsToRender = filteredCars || cars;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are cars to display
    if (!carsToRender || carsToRender.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="empty-message text-center">
                    <i class="fas fa-car"></i>
                    <p>No cars found. Add a new car to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * carsPerPage;
    const endIndex = Math.min(startIndex + carsPerPage, carsToRender.length);
    const paginatedCars = carsToRender.slice(startIndex, endIndex);
    
    // Populate table
    paginatedCars.forEach(car => {
        const row = document.createElement('tr');
        
        // Find category name
        const category = categories.find(cat => cat.category_id === car.category_id);
        const categoryName = category ? category.category_name : 'Unknown';
        
        // Format category with appropriate styling
        const categoryClass = categoryName ? categoryName.toLowerCase() : 'economy';
        const categoryDisplay = `<span class="category-badge ${categoryClass}">${categoryName || 'Unknown'}</span>`;
        
        // Format status
        const statusClass = car.is_active ? 'active' : 'inactive';
        const statusDisplay = `<span class="status-badge ${statusClass}">${car.is_active ? 'Active' : 'Inactive'}</span>`;
        
        row.innerHTML = `
            <td>#${car.id}</td>
            <td>${car.number_plate || ''}</td>
            <td>${categoryDisplay}</td>
            <td>${car.chassis_number || ''}</td>
            <td>${statusDisplay}</td>
            <td class="table-actions">
                <button class="action-btn edit" onclick="editCar(${car.id})" title="Edit Car">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn toggle" onclick="toggleCarStatus(${car.id}, ${!car.is_active})" title="${car.is_active ? 'Mark Inactive' : 'Mark Active'}">
                    <i class="fas fa-${car.is_active ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
                <button class="action-btn delete" onclick="deleteCar(${car.id}, '${car.number_plate}')" title="Delete Car">
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
    const pagination = document.getElementById('carsPagination');
    const totalPages = Math.ceil((cars ? cars.length : 0) / carsPerPage);
    
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
            renderCars();
            renderPagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderCars();
            renderPagination();
        }
    });
    
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderCars();
            renderPagination();
        });
    });
}

/**
 * Filter cars based on search input and dropdown filters
 */
function filterCars() {
    const searchTerm = document.getElementById('searchCars').value.trim().toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    
    let filteredCars = [...cars];
    
    // Apply status filter
    if (statusFilter !== 'all') {
        const isActive = statusFilter === 'true';
        filteredCars = filteredCars.filter(car => car.is_active === isActive);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        // Find category IDs for the selected category name
        const categoryIds = categories
            .filter(cat => cat.category_name === categoryFilter)
            .map(cat => cat.category_id);
            
        filteredCars = filteredCars.filter(car => categoryIds.includes(car.category_id));
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredCars = filteredCars.filter(car => 
            (car.number_plate && car.number_plate.toLowerCase().includes(searchTerm)) ||
            (car.chassis_number && car.chassis_number.toLowerCase().includes(searchTerm)) ||
            (car.id && car.id.toString().includes(searchTerm))
        );
    }
    
    // Reset to first page when filtering
    currentPage = 1;
    
    // Render filtered results
    renderCars(filteredCars);
    renderPagination();
}

/**
 * Show form to add a new car
 */
function showAddCarForm() {
    editMode = false;
    currentCarId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Car';
    
    // Reset the form
    resetForm();
    
    // Scroll to the form
    document.querySelector('.car-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Edit an existing car
 * @param {number} carId - Car ID to edit
 */
function editCar(carId) {
    // Find the car in our data
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
        showAlert('Car not found', 'error');
        return;
    }
    
    // Set edit mode
    editMode = true;
    currentCarId = carId;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit Car';
    
    // Populate the form with car data
    document.getElementById('carId').value = car.id;
    document.getElementById('categoryId').value = car.category_id || '';
    document.getElementById('numberPlate').value = car.number_plate || '';
    document.getElementById('chassisNumber').value = car.chassis_number || '';
    document.getElementById('isActive').value = car.is_active.toString();
    
    // Scroll to the form
    document.querySelector('.car-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Toggle car status (active/inactive)
 * @param {number} carId - Car ID to toggle
 * @param {boolean} newStatus - New status
 */
function toggleCarStatus(carId, newStatus) {
    fetch(`${CARS_ENDPOINT}/${carId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStatus)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update car status');
        }
        return response.json();
    })
    .then(data => {
        // Update the car in our local data
        const car = cars.find(c => c.id === carId);
        if (car) {
            car.is_active = newStatus;
        }
        
        // Re-render the table
        renderCars();
        
        // Show success message
        showAlert(`Car ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
    })
    .catch(error => {
        console.error('Error updating car status:', error);
        showAlert(`Error updating car status: ${error.message}`, 'error');
    });
}

/**
 * Prepare to delete a car
 * @param {number} carId - Car ID to delete
 * @param {string} numberPlate - Car number plate for confirmation
 */
function deleteCar(carId, numberPlate) {
    // Set the car information in the modal
    document.getElementById('deleteCarPlate').textContent = numberPlate || `ID: ${carId}`;
    
    // Store the car ID for the confirmation
    document.getElementById('confirmDeleteBtn').setAttribute('data-car-id', carId);
    
    // Show the delete confirmation modal
    document.getElementById('deleteModal').classList.add('show');
}

/**
 * Confirm and execute car deletion
 */
function confirmDeleteCar() {
    const carId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-car-id'));
    
    // Hide the modal
    document.getElementById('deleteModal').classList.remove('show');
    
    // Send delete request to API
    fetch(`${CARS_ENDPOINT}/${carId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete car');
        }
        return response.json();
    })
    .then(data => {
        // Remove car from our local data
        cars = cars.filter(car => car.id !== carId);
        
        // Re-render the table
        renderCars();
        renderPagination();
        
        // Show success message
        showAlert('Car deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting car:', error);
        showAlert(`Error deleting car: ${error.message}`, 'error');
    });
}

/**
 * Handle form submission (create or update car)
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
    const carData = {
        id: parseInt(formData.get('id')) || 0,
        category_id: parseInt(formData.get('category_id')),
        number_plate: formData.get('number_plate'),
        chassis_number: formData.get('chassis_number'),
        is_active: formData.get('is_active') === 'true'
    };
    
    // Determine if this is a create or update operation
    const isUpdate = editMode && currentCarId > 0;
    
    // API endpoint and method
    const url = isUpdate ? `${CARS_ENDPOINT}/${currentCarId}` : `${CARS_ENDPOINT}/create`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || `Failed to ${isUpdate ? 'update' : 'create'} car`);
            });
        }
        return response.json();
    })
    .then(data => {
        // Refresh the cars list
        loadCars();
        
        // Reset the form
        resetForm();
        
        // Show success message
        showAlert(`Car ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
    })
    .catch(error => {
        console.error(`Error ${isUpdate ? 'updating' : 'creating'} car:`, error);
        showAlert(`Error: ${error.message}`, 'error');
    });
}

/**
 * Validate form before submission
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    // Get form elements
    const form = document.getElementById('carForm');
    const numberPlate = document.getElementById('numberPlate').value.trim();
    const chassisNumber = document.getElementById('chassisNumber').value.trim();
    const categoryId = document.getElementById('categoryId').value;
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Validate required fields
    let isValid = true;
    
    // Validate category selection
    if (!categoryId) {
        isValid = false;
        
        // Add error to category field
        const categoryGroup = document.getElementById('categoryId').closest('.form-group');
        categoryGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please select a category';
        categoryGroup.appendChild(errorMsg);
    }
    
    // Validate number plate format (e.g., ABC-1234)
    const numberPlateRegex = /^[A-Z]{3}-\d{4}$/;
    if (!numberPlateRegex.test(numberPlate)) {
        isValid = false;
        
        // Add error to number plate field
        const numberPlateGroup = document.getElementById('numberPlate').closest('.form-group');
        numberPlateGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Number plate must be in format ABC-1234';
        numberPlateGroup.appendChild(errorMsg);
    }
    
    // Validate chassis number (alphanumeric, at least 10 characters)
    if (chassisNumber.length < 10 || !/^[A-Z0-9]+$/.test(chassisNumber)) {
        isValid = false;
        
        // Add error to chassis number field
        const chassisGroup = document.getElementById('chassisNumber').closest('.form-group');
        chassisGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Chassis number must be at least 10 uppercase alphanumeric characters';
        chassisGroup.appendChild(errorMsg);
    }
    
    return isValid;
}

/**
 * Reset the car form
 */
function resetForm() {
    // Reset form fields
    document.getElementById('carForm').reset();
    document.getElementById('carId').value = "0";
    
    // Clear validation errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Reset form state
    editMode = false;
    currentCarId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Car';
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