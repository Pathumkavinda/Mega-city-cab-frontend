/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * manage-package.js - JavaScript for Mega City Cab Manage Packages page
 * Created on: Mar 10, 2025
 */

// Global variables
let packages = [];
let editMode = false;
let currentPackageId = 0;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const PACKAGES_ENDPOINT = `${API_BASE_URL}/packages`;

// Package types and categories
const PACKAGE_TYPES = ['Day', 'Kilometer'];
const PACKAGE_CATEGORIES = ['Economy', 'Premium', 'Luxury', 'Van'];

// Default values for day packages by category
const DAY_PACKAGE_DEFAULTS = {
    'Economy': { basePrice: 20000, includedKilometers: 250 },
    'Premium': { basePrice: 32000, includedKilometers: 250 },
    'Luxury': { basePrice: 45000, includedKilometers: 250 },
    'Van': { basePrice: 27500, includedKilometers: 250 }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManagePackages();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Packages page
 */
function initManagePackages() {
    // Load admin info
    loadAdminInfo();
    
    // Load packages
    loadPackages();
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
    document.getElementById('packageForm').addEventListener('submit', handleFormSubmit);
    
    // Add new package button
    document.getElementById('addNewBtn').addEventListener('click', showAddPackageForm);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Package type change (to update form fields)
    document.getElementById('packageType').addEventListener('change', updateFormForPackageType);
    
    // Category change (to update default values)
    document.getElementById('categoryName').addEventListener('change', updateDefaultValues);
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Delete package confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeletePackage);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('deleteModal').classList.remove('show');
        });
    });
    
    // Filter change
    document.querySelectorAll('#filterCategory, #filterType, #filterStatus').forEach(filter => {
        filter.addEventListener('change', filterPackages);
    });
}

/**
 * Load packages from the API
 */
function loadPackages() {
    // Show loading indicator
    const tableBody = document.getElementById('packagesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="8" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading packages...
            </td>
        </tr>
    `;
    
    // Fetch packages from API
    fetch(PACKAGES_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load packages');
            }
            return response.json();
        })
        .then(data => {
            packages = Array.isArray(data) ? data : [];
            renderPackages();
        })
        .catch(error => {
            console.error('Error loading packages:', error);
            showAlert(`Error loading packages: ${error.message}`, 'error');
            tableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="8" class="error-message text-center">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load packages. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Render packages in the table
 * @param {Array} filteredPackages - Optional filtered list of packages
 */
function renderPackages(filteredPackages = null) {
    const tableBody = document.getElementById('packagesTable').getElementsByTagName('tbody')[0];
    const packagesToRender = filteredPackages || packages;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are packages to display
    if (!packagesToRender || packagesToRender.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8" class="empty-message text-center">
                    <i class="fas fa-box"></i>
                    <p>No packages found. Add a new package to get started.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Populate table
    packagesToRender.forEach(pkg => {
        const row = document.createElement('tr');
        
        // Format category with appropriate styling
        const categoryClass = pkg.category_name ? pkg.category_name.toLowerCase() : 'economy';
        const categoryDisplay = `<span class="category-badge ${categoryClass}">${pkg.category_name || 'Unknown'}</span>`;
        
        // Format package type
        const typeClass = pkg.package_type ? pkg.package_type.toLowerCase() : 'day';
        const typeDisplay = `<span class="type-badge ${typeClass}">${pkg.package_type || 'Unknown'}</span>`;
        
        // Format price
        const priceDisplay = `<span class="price-display">Rs. ${pkg.base_price.toFixed(2)}</span>`;
        
        // Format status
        const statusClass = pkg.is_active ? 'active' : 'inactive';
        const statusDisplay = `<span class="status-badge ${statusClass}">${pkg.is_active ? 'Active' : 'Inactive'}</span>`;
        
        row.innerHTML = `
            <td>#${pkg.package_id}</td>
            <td>${pkg.package_name || ''}</td>
            <td>${categoryDisplay}</td>
            <td>${typeDisplay}</td>
            <td>${priceDisplay}</td>
            <td>${pkg.package_type === 'Day' ? pkg.included_kilometers + 'km' : 'N/A'}</td>
            <td>${statusDisplay}</td>
            <td class="table-actions">
                <button class="action-btn edit" onclick="editPackage(${pkg.package_id})" title="Edit Package">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn toggle" onclick="togglePackageStatus(${pkg.package_id}, ${!pkg.is_active})" title="${pkg.is_active ? 'Mark Inactive' : 'Mark Active'}">
                    <i class="fas fa-${pkg.is_active ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
                <button class="action-btn delete" onclick="deletePackage(${pkg.package_id}, '${pkg.package_name}')" title="Delete Package">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Filter packages based on selected filters
 */
function filterPackages() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const typeFilter = document.getElementById('filterType').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    let filteredPackages = [...packages];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.category_name === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.package_type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
        const isActive = statusFilter === 'true';
        filteredPackages = filteredPackages.filter(pkg => pkg.is_active === isActive);
    }
    
    // Render filtered results
    renderPackages(filteredPackages);
}

/**
 * Update form fields based on package type selection
 */
function updateFormForPackageType() {
    const packageType = document.getElementById('packageType').value;
    const includedKilometersGroup = document.getElementById('includedKilometersGroup');
    
    if (packageType === 'Day') {
        includedKilometersGroup.style.display = 'flex';
        document.getElementById('includedKilometers').setAttribute('required', true);
    } else {
        includedKilometersGroup.style.display = 'none';
        document.getElementById('includedKilometers').removeAttribute('required');
    }
    
    // Update package name based on type and category
    updatePackageName();
    
    // Update default values
    updateDefaultValues();
}

/**
 * Update package name based on category and type
 */
function updatePackageName() {
    const categoryName = document.getElementById('categoryName').value;
    const packageType = document.getElementById('packageType').value;
    const packageNameInput = document.getElementById('packageName');
    
    if (categoryName && packageType) {
        packageNameInput.value = `${categoryName} ${packageType} Package`;
    }
}

/**
 * Update default values based on category and type selection
 */
function updateDefaultValues() {
    const categoryName = document.getElementById('categoryName').value;
    const packageType = document.getElementById('packageType').value;
    
    // Only set default values if not in edit mode
    if (!editMode && categoryName && packageType) {
        if (packageType === 'Day' && DAY_PACKAGE_DEFAULTS[categoryName]) {
            document.getElementById('basePrice').value = DAY_PACKAGE_DEFAULTS[categoryName].basePrice;
            document.getElementById('includedKilometers').value = DAY_PACKAGE_DEFAULTS[categoryName].includedKilometers;
        } else if (packageType === 'Kilometer') {
            // For kilometer packages, we set lower base prices
            const pricesByCategory = {
                'Economy': 60, // Per km charge
                'Premium': 80,
                'Luxury': 120,
                'Van': 75
            };
            
            if (pricesByCategory[categoryName]) {
                document.getElementById('basePrice').value = pricesByCategory[categoryName];
            }
        }
        
        // Update package name
        updatePackageName();
    }
}

/**
 * Show form to add a new package
 */
function showAddPackageForm() {
    editMode = false;
    currentPackageId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Package';
    
    // Reset the form
    resetForm();
    
    // Update fields based on default package type (Day)
    updateFormForPackageType();
    
    // Scroll to the form
    document.querySelector('.package-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Edit an existing package
 * @param {number} packageId - Package ID to edit
 */
function editPackage(packageId) {
    // Find the package in our data
    const pkg = packages.find(p => p.package_id === packageId);
    
    if (!pkg) {
        showAlert('Package not found', 'error');
        return;
    }
    
    // Set edit mode
    editMode = true;
    currentPackageId = packageId;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit Package';
    
    // Populate the form with package data
    document.getElementById('packageId').value = pkg.package_id;
    document.getElementById('packageName').value = pkg.package_name || '';
    document.getElementById('packageType').value = pkg.package_type || '';
    document.getElementById('categoryName').value = pkg.category_name || '';
    document.getElementById('basePrice').value = pkg.base_price || 0;
    document.getElementById('perKilometerCharge').value = pkg.per_kilometer_charge || 0;
    document.getElementById('waitingCharge').value = pkg.waiting_charge || 0;
    document.getElementById('includedKilometers').value = pkg.included_kilometers || 0;
    document.getElementById('description').value = pkg.description || '';
    document.getElementById('isActive').value = pkg.is_active.toString();
    
    // Update form fields based on package type
    updateFormForPackageType();
    
    // Scroll to the form
    document.querySelector('.package-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Toggle package status (active/inactive)
 * @param {number} packageId - Package ID to toggle
 * @param {boolean} newStatus - New status
 */
function togglePackageStatus(packageId, newStatus) {
    fetch(`${PACKAGES_ENDPOINT}/${packageId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStatus)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update package status');
        }
        return response.json();
    })
    .then(data => {
        // Update the package in our local data
        const pkg = packages.find(p => p.package_id === packageId);
        if (pkg) {
            pkg.is_active = newStatus;
        }
        
        // Re-render the table
        renderPackages();
        
        // Show success message
        showAlert(`Package ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
    })
    .catch(error => {
        console.error('Error updating package status:', error);
        showAlert(`Error updating package status: ${error.message}`, 'error');
    });
}

/**
 * Prepare to delete a package
 * @param {number} packageId - Package ID to delete
 * @param {string} packageName - Package name for confirmation
 */
function deletePackage(packageId, packageName) {
    // Set the package information in the modal
    document.getElementById('deletePackageName').textContent = packageName || `ID: ${packageId}`;
    
    // Store the package ID for the confirmation
    document.getElementById('confirmDeleteBtn').setAttribute('data-package-id', packageId);
    
    // Show the delete confirmation modal
    document.getElementById('deleteModal').classList.add('show');
}

/**
 * Confirm and execute package deletion
 */
function confirmDeletePackage() {
    const packageId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-package-id'));
    
    // Hide the modal
    document.getElementById('deleteModal').classList.remove('show');
    
    // Send delete request to API
    fetch(`${PACKAGES_ENDPOINT}/${packageId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete package');
        }
        return response.json();
    })
    .then(data => {
        // Remove package from our local data
        packages = packages.filter(pkg => pkg.package_id !== packageId);
        
        // Re-render the table
        renderPackages();
        
        // Show success message
        showAlert('Package deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting package:', error);
        showAlert(`Error deleting package: ${error.message}`, 'error');
    });
}

/**
 * Handle form submission (create or update package)
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
    
    // Convert included_kilometers to 0 for Kilometer type packages
    const packageType = formData.get('package_type');
    let includedKilometers = parseInt(formData.get('included_kilometers') || 0);
    if (packageType === 'Kilometer') {
        includedKilometers = 0;
    }
    
    const packageData = {
        package_id: parseInt(formData.get('package_id')) || 0,
        package_name: formData.get('package_name'),
        package_type: packageType,
        category_name: formData.get('category_name'),
        base_price: parseFloat(formData.get('base_price')),
        included_kilometers: includedKilometers,
        per_kilometer_charge: parseFloat(formData.get('per_kilometer_charge')),
        waiting_charge: parseFloat(formData.get('waiting_charge')),
        description: formData.get('description'),
        is_active: formData.get('is_active') === 'true'
    };
    
    // Determine if this is a create or update operation
    const isUpdate = editMode && currentPackageId > 0;
    
    // API endpoint and method
    const url = isUpdate ? `${PACKAGES_ENDPOINT}/${currentPackageId}` : `${PACKAGES_ENDPOINT}/create`;
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(packageData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || `Failed to ${isUpdate ? 'update' : 'create'} package`);
            });
        }
        return response.json();
    })
    .then(data => {
        // Refresh the packages list
        loadPackages();
        
        // Reset the form
        resetForm();
        
        // Show success message
        showAlert(`Package ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
    })
    .catch(error => {
        console.error(`Error ${isUpdate ? 'updating' : 'creating'} package:`, error);
        showAlert(`Error: ${error.message}`, 'error');
    });
}

/**
 * Validate form before submission
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    const form = document.getElementById('packageForm');
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Validate required fields and numeric values
    let isValid = true;
    
    // Validate base price is positive
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    if (isNaN(basePrice) || basePrice <= 0) {
        isValid = false;
        addErrorToField('basePrice', 'Base price must be greater than zero');
    }
    
    // Validate per kilometer charge is non-negative
    const perKmCharge = parseFloat(document.getElementById('perKilometerCharge').value);
    if (isNaN(perKmCharge) || perKmCharge < 0) {
        isValid = false;
        addErrorToField('perKilometerCharge', 'Per kilometer charge must be non-negative');
    }
    
    // Validate waiting charge is non-negative
    const waitingCharge = parseFloat(document.getElementById('waitingCharge').value);
    if (isNaN(waitingCharge) || waitingCharge < 0) {
        isValid = false;
        addErrorToField('waitingCharge', 'Waiting charge must be non-negative');
    }
    
    // Validate included kilometers for Day package
    const packageType = document.getElementById('packageType').value;
    if (packageType === 'Day') {
        const includedKm = parseInt(document.getElementById('includedKilometers').value);
        if (isNaN(includedKm) || includedKm <= 0) {
            isValid = false;
            addErrorToField('includedKilometers', 'Included kilometers must be greater than zero');
        }
    }
    
    return isValid;
}

/**
 * Add error message to a form field
 * @param {string} fieldId - ID of the form field
 * @param {string} message - Error message
 */
function addErrorToField(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    formGroup.appendChild(errorMsg);
}

/**
 * Reset the package form
 */
function resetForm() {
    // Reset form fields
    document.getElementById('packageForm').reset();
    document.getElementById('packageId').value = "0";
    
    // Set default values
    document.getElementById('packageType').value = "Day";
    document.getElementById('categoryName').value = "Economy";
    document.getElementById('isActive').value = "true";
    
    // Update form fields based on package type
    updateFormForPackageType();
    
    // Clear validation errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(el => el.classList.remove('error'));
    
    // Reset form state
    editMode = false;
    currentPackageId = 0;
    
    // Update form title
    document.getElementById('formTitle').textContent = 'Add New Package';
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