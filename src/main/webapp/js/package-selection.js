/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/**
 * package-selection.js - JavaScript for handling package selection in the booking process
 */

// Import the package model
import { 
    VehicleCategory, 
    PackageType, 
    getPackagesByCategory, 
    calculateBookingPrice 
} from './package-model.js';

// Global variables
let selectedCategory = null;
let selectedPackage = null;
let estimatedDistance = 0;
let estimatedWaitingHours = 0;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the package selection UI
    initPackageSelection();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the package selection UI
 */
function initPackageSelection() {
    // Render the category selection tabs
    renderCategoryTabs();
    
    // Set Economy as the default selected category
    selectCategory(VehicleCategory.ECONOMY);
    
    // Update the price estimate with default values
    updatePriceEstimate();
}

/**
 * Render the category selection tabs
 */
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    
    // Clear existing tabs
    tabsContainer.innerHTML = '';
    
    // Create tabs for each category
    const categories = [
        { id: VehicleCategory.ECONOMY, name: 'Economy', icon: 'fa-car' },
        { id: VehicleCategory.PREMIUM, name: 'Premium', icon: 'fa-car-side' },
        { id: VehicleCategory.LUXURY, name: 'Luxury', icon: 'fa-car-alt' },
        { id: VehicleCategory.VAN, name: 'Van', icon: 'fa-shuttle-van' }
    ];
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.dataset.category = category.id;
        
        tab.innerHTML = `
            <i class="fas ${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        tab.addEventListener('click', () => selectCategory(category.id));
        
        tabsContainer.appendChild(tab);
    });
}

/**
 * Select a category and display its packages
 * @param {string} categoryId - The category ID to select
 */
function selectCategory(categoryId) {
    // Update the selected category
    selectedCategory = categoryId;
    
    // Update active tab styling
    document.querySelectorAll('.category-tab').forEach(tab => {
        if (tab.dataset.category === categoryId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Render the packages for the selected category
    renderPackageOptions(categoryId);
}

/**
 * Render package options for the selected category
 * @param {string} categoryId - The category ID to display packages for
 */
function renderPackageOptions(categoryId) {
    const packagesContainer = document.getElementById('packageOptions');
    
    // Clear existing packages
    packagesContainer.innerHTML = '';
    
    // Get packages for the selected category
    const packagesByCategory = getPackagesByCategory();
    const categoryPackages = packagesByCategory[categoryId] || [];
    
    // Create package option cards
    categoryPackages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        packageCard.dataset.packageId = pkg.id;
        
        // Determine package icon based on type
        const packageIcon = pkg.type === PackageType.DAY 
            ? 'fa-calendar-day' 
            : 'fa-route';
        
        // Format price display
        const priceDisplay = pkg.type === PackageType.DAY
            ? `Rs. ${pkg.basePrice.toLocaleString()}`
            : `Rs. ${pkg.perKilometerRate} per km`;
        
        // Create included features list
        let featuresHTML = '';
        
        if (pkg.type === PackageType.DAY) {
            featuresHTML += `
                <li><i class="fas fa-check"></i> ${pkg.includedKilometers} kilometers included</li>
                <li><i class="fas fa-check"></i> Additional km: Rs. ${kilometerRates[categoryId]} per km</li>
            `;
        } else {
            featuresHTML += `
                <li><i class="fas fa-check"></i> Pay only for distance traveled</li>
                <li><i class="fas fa-check"></i> No minimum distance required</li>
            `;
        }
        
        featuresHTML += `<li><i class="fas fa-${pkg.waitingChargeIncluded ? 'check' : 'times'}"></i> Waiting charges ${pkg.waitingChargeIncluded ? 'included' : 'extra'}</li>`;
        
        packageCard.innerHTML = `
            <div class="package-header">
                <i class="fas ${packageIcon}"></i>
                <h3>${pkg.name}</h3>
            </div>
            <div class="package-price">${priceDisplay}</div>
            <div class="package-description">${pkg.description}</div>
            <ul class="package-features">
                ${featuresHTML}
            </ul>
            <button class="select-package-btn" data-package-id="${pkg.id}">Select Package</button>
        `;
        
        packagesContainer.appendChild(packageCard);
    });
    
    // Add event listeners to the select buttons
    document.querySelectorAll('.select-package-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packageId = parseInt(e.target.dataset.packageId);
            selectPackage(packageId);
        });
    });
}

/**
 * Select a package
 * @param {number} packageId - The package ID to select
 */
function selectPackage(packageId) {
    // Update selected package
    const allPackages = getPackagesByCategory();
    const allPackagesList = Object.values(allPackages).flat();
    selectedPackage = allPackagesList.find(pkg => pkg.id === packageId);
    
    // Update UI to show selected package
    document.querySelectorAll('.package-card').forEach(card => {
        if (parseInt(card.dataset.packageId) === packageId) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Show the booking details section
    document.getElementById('bookingDetails').classList.remove('hidden');
    
    // Update the booking summary
    updateBookingSummary();
    
    // Update the price estimate
    updatePriceEstimate();
}

/**
 * Update the booking summary with selected package details
 */
function updateBookingSummary() {
    const summaryElement = document.getElementById('bookingSummary');
    
    if (!selectedPackage) {
        summaryElement.innerHTML = '<p>Please select a package to continue</p>';
        return;
    }
    
    // Get category name
    const categoryNames = {
        [VehicleCategory.ECONOMY]: 'Economy',
        [VehicleCategory.PREMIUM]: 'Premium',
        [VehicleCategory.LUXURY]: 'Luxury',
        [VehicleCategory.VAN]: 'Van'
    };
    
    // Package details
    summaryElement.innerHTML = `
        <h3>Selected Package</h3>
        <div class="summary-detail">
            <span class="detail-label">Category:</span>
            <span class="detail-value">${categoryNames[selectedPackage.category]}</span>
        </div>
        <div class="summary-detail">
            <span class="detail-label">Package:</span>
            <span class="detail-value">${selectedPackage.name}</span>
        </div>
        <div class="summary-detail">
            <span class="detail-label">Package Type:</span>
            <span class="detail-value">${selectedPackage.type === PackageType.DAY ? 'Day Package' : 'Per Kilometer'}</span>
        </div>
    `;
    
    // Show the distance and waiting time inputs
    document.getElementById('estimateInputs').classList.remove('hidden');
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Distance input
    document.getElementById('estimatedDistance').addEventListener('input', function(e) {
        estimatedDistance = parseFloat(e.target.value) || 0;
        updatePriceEstimate();
    });
    
    // Waiting hours input
    document.getElementById('estimatedWaiting').addEventListener('input', function(e) {
        estimatedWaitingHours = parseFloat(e.target.value) || 0;
        updatePriceEstimate();
    });
    
    // Continue button
    document.getElementById('continueBooking').addEventListener('click', function() {
        if (!selectedPackage) {
            showAlert('Please select a package to continue', 'warning');
            return;
        }
        
        // Get booking details for the next step
        const bookingDetails = {
            packageId: selectedPackage.id,
            categoryId: selectedPackage.category,
            estimatedDistance: estimatedDistance,
            estimatedWaitingHours: estimatedWaitingHours,
            priceEstimate: calculateBookingPrice(selectedPackage.id, estimatedDistance, estimatedWaitingHours)
        };
        
        // Store booking details for the next step
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Navigate to the next step (vehicle selection)
        window.location.href = 'vehicle-selection.html';
    });
}

/**
 * Update the price estimate based on selected package and inputs
 */
function updatePriceEstimate() {
    const estimateElement = document.getElementById('priceEstimate');
    
    if (!selectedPackage || estimatedDistance <= 0) {
        estimateElement.innerHTML = '<p>Enter distance to see price estimate</p>';
        return;
    }
    
    try {
        // Calculate the price breakdown
        const priceBreakdown = calculateBookingPrice(
            selectedPackage.id, 
            estimatedDistance, 
            estimatedWaitingHours
        );
        
        // Update the UI with price breakdown
        estimateElement.innerHTML = `
            <h3>Price Estimate</h3>
            <div class="price-breakdown">
                <div class="breakdown-item">
                    <span class="item-label">Base Price:</span>
                    <span class="item-value">Rs. ${priceBreakdown.basePrice.toLocaleString()}</span>
                </div>
                
                ${priceBreakdown.additionalKmCharge > 0 ? `
                <div class="breakdown-item">
                    <span class="item-label">Additional Kilometers (${priceBreakdown.breakdown.additionalKilometers} km):</span>
                    <span class="item-value">Rs. ${priceBreakdown.additionalKmCharge.toLocaleString()}</span>
                </div>
                ` : ''}
                
                ${priceBreakdown.waitingCharge > 0 ? `
                <div class="breakdown-item">
                    <span class="item-label">Waiting Charge (${priceBreakdown.breakdown.waitingHours} hours):</span>
                    <span class="item-value">Rs. ${priceBreakdown.waitingCharge.toLocaleString()}</span>
                </div>
                ` : ''}
                
                <div class="breakdown-total">
                    <span class="total-label">Total Estimate:</span>
                    <span class="total-value">Rs. ${priceBreakdown.totalPrice.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="estimate-note">
                <i class="fas fa-info-circle"></i>
                <span>Final price may vary based on actual distance and waiting time.</span>
            </div>
        `;
        
        // Show the continue button
        document.getElementById('continueBooking').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error calculating price:', error);
        estimateElement.innerHTML = `<p class="error">Error calculating price: ${error.message}</p>`;
    }
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning, info)
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    
    alertBox.innerHTML = `
        <span class="alert-message">${message}</span>
        <button class="alert-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add close button functionality
    alertBox.querySelector('.alert-close').addEventListener('click', () => {
        alertBox.remove();
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertBox.parentNode) {
            alertBox.remove();
        }
    }, 5000);
    
    // Add to the DOM
    alertContainer.appendChild(alertBox);
}

// Export functions for use in other modules
export {
    selectCategory,
    selectPackage,
    updatePriceEstimate
};