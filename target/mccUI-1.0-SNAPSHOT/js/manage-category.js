/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
/**
 * manage-category.js - JavaScript for Mega City Cab Manage Categories page
 * Created on: Mar 9, 2025
 * Updated on: Mar 10, 2025
 */

// Global variables
let categories = [];
let cars = [];
let editMode = false;
let currentCategoryId = 0;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;

// Category passenger limits
const PASSENGER_LIMITS = {
    'Economy': 3,
    'Premium': 4,
    'Luxury': 4,
    'Van': 8
};

// Suggested pricing ranges (for UX guidance)
const PRICE_RANGES = {
    'Economy': { pricePerKm: { min: 1.00, max: 2.00 }, waitingCharge: { min: 5.00, max: 10.00 } },
    'Premium': { pricePerKm: { min: 2.00, max: 3.50 }, waitingCharge: { min: 10.00, max: 15.00 } },
    'Luxury': { pricePerKm: { min: 3.50, max: 5.00 }, waitingCharge: { min: 15.00, max: 25.00 } },
    'Van': { pricePerKm: { min: 2.50, max: 4.00 }, waitingCharge: { min: 12.00, max: 20.00 } }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManageCategories();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Categories page
 */
function initManageCategories() {
    // Load admin info
    loadAdminInfo();
    
    // Load cars for dropdown
    loadCars();
    
    // Load categories
    loadCategories();
    
    // Initialize max passengers info
    updateMaxPassengers();
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
    document.getElementById('categoryForm').addEventListener('submit', handleFormSubmit);
    
    // Add new category button
    document.getElementById('addNewBtn').addEventListener('click', showAddCategoryForm);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Category name change (to update max passengers and price ranges)
    document.getElementById('categoryName').addEventListener('change', function() {
        updateMaxPassengers();
        updatePriceRanges();
    });
    
    // Max passengers input validation
    document.getElementById('maxPassengers').addEventListener('input', validateMaxPassengers);
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Delete category confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteCategory);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('deleteModal').classList.remove('show');
        });
    });
    
    // Filter dropdowns
    document.getElementById('filterAvailability').addEventListener('change', filterCategories);
    document.getElementById('filterCategory').addEventListener('change', filterCategories);
}

/**
 * Load categories from the API
 */
function loadCategories() {
    // Show loading indicator
    const tableBody = document.getElementById('categoriesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="9" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading categories...
            </td>
        </tr>
    `;
    
    // Fetch categories from API
    fetch(CATEGORIES_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load categories');
            }
            return response.json();
        })
        .then(data => {
            categories = Array.isArray(data) ? data : [];
            renderCategories();
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            showAlert(`Error loading categories: ${error.message}`, 'error');
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="9" class="error-message text-center">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load categories. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Load cars from the API for the dropdown
 */
function loadCars() {
    fetch(CARS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load cars');
            }
            return response.json();
        })
        .then(data => {
            cars = Array.isArray(data) ? data : [];
            populateCarDropdown();
        })
        .catch(error => {
            console.error('Error loading cars:', error);
            showAlert(`Error loading cars: ${error.message}`, 'error');
        });
}

/**
 * Populate car dropdown options
 */
function populateCarDropdown() {
    const carSelect = document.getElementById('carId');
    
    // Clear existing options (except the first placeholder)
    while (carSelect.options.length > 1) {
        carSelect.remove(1);
    }
    
    // Add car options
    cars.forEach(car => {
        if (car.is_active) { // Only show active cars
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.number_plate} (${car.category_name || 'Not assigned'})`;
            carSelect.appendChild(option);
        }
    });
}

/**
 * Render categories in the table
 * @param {Array} filteredCategories - Optional filtered list of categories
 */
function renderCategories(filteredCategories = null) {
    const tableBody = document.getElementById('categoriesTable').getElementsByTagName('tbody')[0];
    const categoriesToRender = filteredCategories || categories;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are categories to display
    if (!categoriesToRender || categoriesToRender.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9" class="empty-message text-center">
                    <i class="fas fa-tags"></i>
                    <p>No categories found. Add a new category to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Populate table
    categoriesToRender.forEach(category => {
        const row = document.createElement('tr');
        
        // Find associated car
        const car = cars.find(c => c.id === category.car_id);
        const carDetails = car ? `${car.number_plate} (${car.category_name || 'Not assigned'})` : 'Not assigned';
        
        // Format category name with appropriate styling
        const categoryClass = category.category_name ? category.category_name.toLowerCase() : 'economy';
        const categoryDisplay = `<span class="category-badge ${categoryClass}">${category.category_name || 'Unknown'}</span>`;
        
        // Format availability status
        const statusClass = category.is_available ? 'available' : 'unavailable';
        const statusDisplay = `<span class="status-badge ${statusClass}">${category.is_available ? 'Available' : 'Not Available'}</span>`;
        
        // Format price values
        const formattedPricePerKm = category.price_per_km ? `$${parseFloat(category.price_per_km).toFixed(2)}` : 'N/A';
        const formattedWaitingCharge = category.waiting_charge ? `$${parseFloat(category.waiting_charge).toFixed(2)}` : 'N/A';
        
        row.innerHTML = `
            <td>#${category.category_id}</td>
            <td>${categoryDisplay}</td>
            <td>${category.car_id ? '#' + category.car_id : 'N/A'}</td>
            <td>${carDetails}</td>
            <td>${category.max_passengers}</td>
            <td>${formattedPricePerKm}</td>
            <td>${formattedWaitingCharge}</td>
            <td>${statusDisplay}</td>
            <td class="table-actions">
                <button class="action-btn edit" onclick="editCategory(${category.category_id})" title="Edit Category">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn toggle" onclick="toggleAvailability(${category.category_id}, ${!category.is_available})" title="${category.is_available ? 'Mark Unavailable' : 'Mark Available'}">
                    <i class="fas fa-${category.is_available ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
                <button class="action-btn delete" onclick="deleteCategory(${category.category_id}, '${category.category_name}')" title="Delete Category">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Filter categories based on selected filters
 */
function filterCategories() {
    const availabilityFilter = document.getElementById('filterAvailability').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    
    let filteredCategories = [...categories];
    
    // Apply availability filter
    if (availabilityFilter !== 'all') {
        const isAvailable = availabilityFilter === 'true';
        filteredCategories = filteredCategories.filter(category => category.is_available === isAvailable);
    }
    
    // Apply category name filter
    if (categoryFilter !== 'all') {
        filteredCategories = filteredCategories.filter(category => category.category_name === categoryFilter);
    }
    
    // Render filtered results
    renderCategories(filteredCategories);
}

/**
 * Update max passengers info based on selected category
 */
function updateMaxPassengers() {
    const categoryName = document.getElementById('categoryName').value;
    const maxPassengersInput = document.getElementById('maxPassengers');
    const infoText = document.getElementById('passengerLimit');
    
    if (categoryName) {
        const maxLimit = PASSENGER_LIMITS[categoryName];
        infoText.textContent = `Maximum ${maxLimit} passengers allowed for ${categoryName}`;
        maxPassengersInput.max = maxLimit;
        
        // Set a default value
        if (!maxPassengersInput.value || parseInt(maxPassengersInput.value) > maxLimit) {
            maxPassengersInput.value = maxLimit;
        }
    } else {
        infoText.textContent = '';
    }
}

/**
 * Update price range hints based on selected category
 */
function updatePriceRanges() {
    const categoryName = document.getElementById('categoryName').value;
    const pricePerKmInput = document.getElementById('pricePerKm');
    const waitingChargeInput = document.getElementById('waitingCharge');
    
    if (categoryName && PRICE_RANGES[categoryName]) {
        const priceRange = PRICE_RANGES[categoryName];
        
        // Update price per km
        const pricePerKmParent = pricePerKmInput.closest('.form-group');
        let priceInfoText = pricePerKmParent.querySelector('.info-text');
        
        if (!priceInfoText) {
            priceInfoText = document.createElement('span');
            priceInfoText.className = 'info-text';
            pricePerKmParent.appendChild(priceInfoText);
        }
        
        priceInfoText.textContent = `Suggested range: $${priceRange.pricePerKm.min.toFixed(2)} - $${priceRange.pricePerKm.max.toFixed(2)}`;
        
        // Update waiting charge
        const waitingChargeParent = waitingChargeInput.closest('.form-group');
        let waitingInfoText = waitingChargeParent.querySelector('.info-text');
        
        if (!waitingInfoText) {
            waitingInfoText = document.createElement('span');
            waitingInfoText.className = 'info-text';
            waitingChargeParent.appendChild(waitingInfoText);
        }
        
        waitingInfoText.textContent = `Suggested range: $${priceRange.waitingCharge.min.toFixed(2)} - $${priceRange.waitingCharge.max.toFixed(2)}`;
        
        // Set default values if empty
        if (!pricePerKmInput.value) {
            pricePerKmInput.value = priceRange.pricePerKm.min.toFixed(2);
        }
        
        if (!waitingChargeInput.value) {
            waitingChargeInput.value = priceRange.waitingCharge.min.toFixed(2);
        }
    } else {
        // Remove hints if no category selected
        const infoTexts = document.querySelectorAll('#pricePerKm, #waitingCharge').forEach(input => {
            const infoText = input.closest('.form-group').querySelector('.info-text');
            if (infoText) {
                infoText.textContent = '';
            }
        });
    }
}

/**
 * Validate max passengers based on selected category
 */
function validateMaxPassengers() {
    const categoryName = document.getElementById('categoryName').value;
    const maxPassengersInput = document.getElementById('maxPassengers');
    const maxLimit = PASSENGER_LIMITS[categoryName];
    
    if (categoryName && maxLimit) {
        const value = parseInt(maxPassengersInput.value);
        
        if (value > maxLimit) {
            maxPassengersInput.value = maxLimit;
        } else if (value < 1) {
            maxPassengersInput.value = 1;
        }
    }
}

/**
 * Show form to add a new category
 */
function showAddCategoryForm() {
    editMode = false;
    currentCategoryId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Category';
    
    // Reset the form
    resetForm();
    
    // Scroll to the form
    document.querySelector('.category-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Edit an existing category
 * @param {number} categoryId - Category ID to edit
 */
function editCategory(categoryId) {
    // Find the category in our data
    const category = categories.find(c => c.category_id === categoryId);
    
    if (!category) {
        showAlert('Category not found', 'error');
        return;
    }
    
    // Set edit mode
    editMode = true;
    currentCategoryId = categoryId;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit Category';
    
    // Populate the form with category data
    document.getElementById('categoryId').value = category.category_id;
    document.getElementById('categoryName').value = category.category_name || '';
    document.getElementById('carId').value = category.car_id || '';
    document.getElementById('maxPassengers').value = category.max_passengers || '';
    document.getElementById('pricePerKm').value = category.price_per_km ? parseFloat(category.price_per_km).toFixed(2) : '';
    document.getElementById('waitingCharge').value = category.waiting_charge ? parseFloat(category.waiting_charge).toFixed(2) : '';
    document.getElementById('isAvailable').value = category.is_available.toString();
    
    // Update max passengers and price ranges info
    updateMaxPassengers();
    updatePriceRanges();
    
    // Scroll to the form
    document.querySelector('.category-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Toggle category availability
 * @param {number} categoryId - Category ID to toggle
 * @param {boolean} newAvailability - New availability status
 */
function toggleAvailability(categoryId, newAvailability) {
    fetch(`${CATEGORIES_ENDPOINT}/${categoryId}/availability`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAvailability)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update category availability');
        }
        return response.json();
    })
    .then(data => {
        // Update the category in our local data
        const category = categories.find(c => c.category_id === categoryId);
        if (category) {
            category.is_available = newAvailability;
        }
        
        // Re-render the table
        renderCategories();
        
        // Show success message
        showAlert(`Category ${newAvailability ? 'marked available' : 'marked unavailable'} successfully`, 'success');
    })
    .catch(error => {
        console.error('Error updating category availability:', error);
        showAlert(`Error updating category availability: ${error.message}`, 'error');
    });
}

/**
 * Prepare to delete a category
 * @param {number} categoryId - Category ID to delete
 * @param {string} categoryName - Category name for confirmation
 */
function deleteCategory(categoryId, categoryName) {
    // Set the category information in the modal
    document.getElementById('deleteCategoryName').textContent = categoryName || `ID: ${categoryId}`;
    
    // Store the category ID for the confirmation
    document.getElementById('confirmDeleteBtn').setAttribute('data-category-id', categoryId);
    
    // Show the delete confirmation modal
    document.getElementById('deleteModal').classList.add('show');
}

/**
 * Confirm and execute category deletion
 */
function confirmDeleteCategory() {
    const categoryId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-category-id'));
    
    // Hide the modal
    document.getElementById('deleteModal').classList.remove('show');
    
    // Send delete request to API
    fetch(`${CATEGORIES_ENDPOINT}/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete category');
        }
        return response.json();
    })
    .then(data => {
        // Remove category from our local data
        categories = categories.filter(category => category.category_id !== categoryId);
        
        // Re-render the table
        renderCategories();
        
        // Show success message
        showAlert('Category deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting category:', error);
        showAlert(`Error deleting category: ${error.message}`, 'error');
    });
}

/**
 * Handle form submission (create or update category)
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
    const categoryData = {
        category_id: parseInt(formData.get('category_id')) || 0,
        category_name: formData.get('category_name'),
        car_id: formData.get('car_id') ? parseInt(formData.get('car_id')) : null,
        max_passengers: parseInt(formData.get('max_passengers')),
        price_per_km: parseFloat(formData.get('price_per_km')),
        waiting_charge: parseFloat(formData.get('waiting_charge')),
        is_available: formData.get('is_available') === 'true'
    };
    
    // Determine if this is a create or update operation
    const isUpdate = editMode && currentCategoryId > 0;
    
    // API endpoint and method
    const url = isUpdate ? `${CATEGORIES_ENDPOINT}/${currentCategoryId}` : `${CATEGORIES_ENDPOINT}/create`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || `Failed to ${isUpdate ? 'update' : 'create'} category`);
            });
        }
        return response.json();
    })
    .then(data => {
        // Refresh the categories list
        loadCategories();
        
        // Reset the form
        resetForm();
        
        // Show success message
        showAlert(`Category ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
    })
    .catch(error => {
        console.error(`Error ${isUpdate ? 'updating' : 'creating'} category:`, error);
        showAlert(`Error: ${error.message}`, 'error');
    });
}

/**
 * Validate form before submission
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    // Get form elements
    const form = document.getElementById('categoryForm');
    const categoryName = document.getElementById('categoryName').value;
    const maxPassengers = parseInt(document.getElementById('maxPassengers').value);
    const pricePerKm = parseFloat(document.getElementById('pricePerKm').value);
    const waitingCharge = parseFloat(document.getElementById('waitingCharge').value);
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Validate required fields
    let isValid = true;
    
    // Check max passengers limit
    if (categoryName && PASSENGER_LIMITS[categoryName]) {
        const maxLimit = PASSENGER_LIMITS[categoryName];
        
        if (maxPassengers < 1 || maxPassengers > maxLimit) {
            isValid = false;
            
            // Add error to max passengers field
            const passengersGroup = document.getElementById('maxPassengers').closest('.form-group');
            passengersGroup.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = `Maximum passengers for ${categoryName} must be between 1 and ${maxLimit}`;
            passengersGroup.appendChild(errorMsg);
        }
    }
    
    // Validate price per km
    if (isNaN(pricePerKm) || pricePerKm <= 0) {
        isValid = false;
        
        // Add error to price per km field
        const priceGroup = document.getElementById('pricePerKm').closest('.form-group');
        priceGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Price per kilometer must be a positive number';
        priceGroup.appendChild(errorMsg);
    }
    
    // Validate waiting charge
    if (isNaN(waitingCharge) || waitingCharge <= 0) {
        isValid = false;
        
        // Add error to waiting charge field
        const waitingGroup = document.getElementById('waitingCharge').closest('.form-group');
        waitingGroup.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Waiting charge must be a positive number';
        waitingGroup.appendChild(errorMsg);
    }
    
    return isValid;
}

/**
 * Reset the category form
 */
function resetForm() {
    // Reset form fields
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = "0";
    
    // Clear validation errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Reset form state
    editMode = false;
    currentCategoryId = 0;
    
    // Update the passenger limit and price range info
    updateMaxPassengers();
    updatePriceRanges();
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Category';
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