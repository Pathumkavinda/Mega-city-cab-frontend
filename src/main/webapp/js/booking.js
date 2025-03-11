/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * booking.js - JavaScript for Mega City Cab Booking page
 * Created on: Mar 10, 2025
 */

// Global variables
let currentStep = 1;
let totalSteps = 4;
let packages = [];
let cars = [];
let selectedPackage = null;
let selectedCar = null;
let userId = null;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const PACKAGES_ENDPOINT = `${API_BASE_URL}/packages`;
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserLogin();
    
    // Initialize the booking process
    initBooking();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Check if user is logged in
 */
function checkUserLogin() {
    // Get user ID from session storage
    userId = sessionStorage.getItem('userId');
    
    // If not logged in, redirect to login page
    if (!userId) {
        window.location.href = 'login.jsp';
    }
}

/**
 * Initialize the booking process
 */
function initBooking() {
    // Set minimum date for pickup to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('pickupDate').min = formattedDate;
    
    // Set default pickup time to current time + 1 hour
    const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
    const hours = nextHour.getHours().toString().padStart(2, '0');
    const minutes = nextHour.getMinutes().toString().padStart(2, '0');
    document.getElementById('pickupTime').value = `${hours}:${minutes}`;
    
    // Load active packages
    loadPackages();
    
    // Show the first step
    showStep(1);
    
    // Update progress bar
    updateProgress(1);
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Next and previous buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function() {
            const stepIndex = parseInt(this.getAttribute('data-step'));
            
            // Validate current step before proceeding
            if (validateStep(stepIndex)) {
                nextStep();
            }
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function() {
            prevStep();
        });
    });
    
    // Package selection
    document.getElementById('packageOptions').addEventListener('click', function(e) {
        const packageCard = e.target.closest('.package-card');
        if (packageCard) {
            selectPackage(packageCard);
        }
    });
    
    // Car selection
    document.getElementById('carOptions').addEventListener('click', function(e) {
        const carCard = e.target.closest('.car-card');
        if (carCard) {
            selectCar(carCard);
        }
    });
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
    
    // Final confirmation button
    document.getElementById('confirmBookingBtn').addEventListener('click', function() {
        submitBooking();
    });
    
    // Form change events for updating summary
    document.querySelectorAll('#step1 input, #step1 select, #step2 input').forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });
    
    // Package type filter
    document.getElementById('packageTypeFilter').addEventListener('change', filterPackages);
}

/**
 * Load active packages from the API
 */
function loadPackages() {
    // Show loading indicator
    const packageOptions = document.getElementById('packageOptions');
    packageOptions.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> Loading packages...
        </div>
    `;
    
    // Fetch active packages from API
    fetch(`${PACKAGES_ENDPOINT}?active=true`)
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
            packageOptions.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> Failed to load packages. Please try again.
                </div>
            `;
        });
}

/**
 * Render packages in the package options section
 */
function renderPackages(filteredPackages = null) {
    const packageOptions = document.getElementById('packageOptions');
    const packagesToRender = filteredPackages || packages;
    
    // Clear container
    packageOptions.innerHTML = '';
    
    // Check if there are packages to display
    if (!packagesToRender || packagesToRender.length === 0) {
        packageOptions.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-box"></i>
                <p>No packages available for the selected criteria.</p>
            </div>
        `;
        return;
    }
    
    // Render packages
    packagesToRender.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        packageCard.setAttribute('data-package-id', pkg.package_id);
        
        // Set selected class if this package is the selected one
        if (selectedPackage && selectedPackage.package_id === pkg.package_id) {
            packageCard.classList.add('selected');
        }
        
        // Format category name for display
        const categoryClass = pkg.category_name ? pkg.category_name.toLowerCase() : 'economy';
        
        // Format description based on package type
        let packageDetails = '';
        if (pkg.package_type === 'Day') {
            packageDetails = `
                <div class="package-details">
                    <i class="fas fa-road"></i> ${pkg.included_kilometers}km included
                </div>
                <div class="package-details">
                    <i class="fas fa-coins"></i> Rs. ${pkg.per_kilometer_charge.toFixed(2)}/km after limit
                </div>
            `;
        } else {
            packageDetails = `
                <div class="package-details">
                    <i class="fas fa-coins"></i> Rs. ${pkg.per_kilometer_charge.toFixed(2)}/km
                </div>
            `;
        }
        
        packageCard.innerHTML = `
            <div class="package-category ${categoryClass}">${pkg.category_name}</div>
            <div class="package-name">${pkg.package_name}</div>
            <div class="package-price">Rs. ${pkg.base_price.toFixed(2)}</div>
            ${packageDetails}
            <div class="package-details">
                <i class="fas fa-clock"></i> Waiting charge: Rs. ${pkg.waiting_charge.toFixed(2)}
            </div>
        `;
        
        packageOptions.appendChild(packageCard);
    });
}

/**
 * Filter packages based on type selection
 */
function filterPackages() {
    const packageTypeFilter = document.getElementById('packageTypeFilter').value;
    
    if (packageTypeFilter === 'all') {
        renderPackages();
        return;
    }
    
    // Filter packages by type
    const filteredPackages = packages.filter(pkg => pkg.package_type === packageTypeFilter);
    renderPackages(filteredPackages);
}

/**
 * Load cars for the selected package category
 */
function loadCars() {
    // Only load cars if a package is selected
    if (!selectedPackage) {
        return;
    }
    
    const carOptions = document.getElementById('carOptions');
    
    // Show loading indicator
    carOptions.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i> Loading available cars...
        </div>
    `;
    
    // Fetch cars from API by category
    fetch(`${CARS_ENDPOINT}?status=true&category=${selectedPackage.category_name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load cars');
            }
            return response.json();
        })
        .then(data => {
            cars = Array.isArray(data) ? data : [];
            renderCars();
        })
        .catch(error => {
            console.error('Error loading cars:', error);
            carOptions.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> Failed to load cars. Please try again.
                </div>
            `;
        });
}

/**
 * Render cars in the car options section
 */
function renderCars() {
    const carOptions = document.getElementById('carOptions');
    
    // Clear container
    carOptions.innerHTML = '';
    
    // Check if there are cars to display
    if (!cars || cars.length === 0) {
        carOptions.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-car"></i>
                <p>No cars available for this category.</p>
            </div>
        `;
        return;
    }
    
    // Render cars
    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.setAttribute('data-car-id', car.id);
        
        // Set selected class if this car is the selected one
        if (selectedCar && selectedCar.id === car.id) {
            carCard.classList.add('selected');
        }
        
        // Format category name for display
        const categoryClass = car.category_name ? car.category_name.toLowerCase() : 'economy';
        
        carCard.innerHTML = `
            <div class="car-icon">
                <i class="fas fa-car"></i>
            </div>
            <div class="car-plate">${car.number_plate}</div>
            <div class="car-category ${categoryClass}">${car.category_name}</div>
            <div class="car-details">
                <i class="fas fa-id-card"></i> ${car.chassis_number}
            </div>
        `;
        
        carOptions.appendChild(carCard);
    });
}

/**
 * Select a package
 * @param {HTMLElement} packageCard - Selected package card element
 */
function selectPackage(packageCard) {
    // Remove selected class from all package cards
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    packageCard.classList.add('selected');
    
    // Get package ID from data attribute
    const packageId = parseInt(packageCard.getAttribute('data-package-id'));
    
    // Find the package in our data
    selectedPackage = packages.find(pkg => pkg.package_id === packageId);
    
    // Update the next button
    updateNextButton();
    
    // Update booking summary
    updateBookingSummary();
}

/**
 * Select a car
 * @param {HTMLElement} carCard - Selected car card element
 */
function selectCar(carCard) {
    // Remove selected class from all car cards
    document.querySelectorAll('.car-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    carCard.classList.add('selected');
    
    // Get car ID from data attribute
    const carId = parseInt(carCard.getAttribute('data-car-id'));
    
    // Find the car in our data
    selectedCar = cars.find(car => car.id === carId);
    
    // Update the next button
    updateNextButton();
    
    // Update booking summary
    updateBookingSummary();
}

/**
 * Update the next button state based on step validation
 */
function updateNextButton() {
    const nextBtn = document.querySelector(`.btn-next[data-step="${currentStep}"]`);
    
    if (!nextBtn) return;
    
    let isValid = false;
    
    switch (currentStep) {
        case 1:
            // Location step - validate both pickup and destination
            const pickupLocation = document.getElementById('pickupLocation').value;
            const destination = document.getElementById('destination').value;
            isValid = pickupLocation && destination;
            break;
        case 2:
            // Package step - validate package selection
            isValid = selectedPackage !== null;
            break;
        case 3:
            // Car step - validate car selection
            isValid = selectedCar !== null;
            break;
        default:
            isValid = true;
    }
    
    nextBtn.disabled = !isValid;
}

/**
 * Update booking summary
 */
function updateBookingSummary() {
    const summaryContainer = document.getElementById('bookingSummary');
    
    // Details to display
    const pickupLocation = document.getElementById('pickupLocation').value || 'Not specified';
    const destination = document.getElementById('destination').value || 'Not specified';
    const pickupDate = document.getElementById('pickupDate').value || 'Not specified';
    const pickupTime = document.getElementById('pickupTime').value || 'Not specified';
    const passengers = document.getElementById('passengers').value || '1';
    const notes = document.getElementById('notes').value || 'None';
    
    // Format date and time
    let formattedDateTime = 'Not specified';
    if (pickupDate && pickupTime) {
        const date = new Date(`${pickupDate}T${pickupTime}`);
        formattedDateTime = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Package details
    let packageDetails = 'No package selected';
    let priceDetails = '';
    let totalPrice = 0;
    
    if (selectedPackage) {
        // Basic package info
        packageDetails = `
            <div class="summary-row">
                <span class="summary-label">Package Name:</span>
                <span class="summary-value">${selectedPackage.package_name}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Category:</span>
                <span class="summary-value">${selectedPackage.category_name}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Package Type:</span>
                <span class="summary-value">${selectedPackage.package_type}</span>
            </div>
        `;
        
        // Price calculations
        totalPrice = selectedPackage.base_price;
        
        priceDetails = `
            <div class="summary-row">
                <span class="summary-label">Base Price:</span>
                <span class="summary-value">Rs. ${selectedPackage.base_price.toFixed(2)}</span>
            </div>
        `;
        
        if (selectedPackage.package_type === 'Day') {
            priceDetails += `
                <div class="summary-row">
                    <span class="summary-label">Included Kilometers:</span>
                    <span class="summary-value">${selectedPackage.included_kilometers} km</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Extra KM Charge:</span>
                    <span class="summary-value">Rs. ${selectedPackage.per_kilometer_charge.toFixed(2)}/km</span>
                </div>
            `;
        } else {
            priceDetails += `
                <div class="summary-row">
                    <span class="summary-label">Per Kilometer Charge:</span>
                    <span class="summary-value">Rs. ${selectedPackage.per_kilometer_charge.toFixed(2)}/km</span>
                </div>
            `;
        }
        
        priceDetails += `
            <div class="summary-row">
                <span class="summary-label">Waiting Charge:</span>
                <span class="summary-value">Rs. ${selectedPackage.waiting_charge.toFixed(2)}</span>
            </div>
        `;
    }
    
    // Car details
    let carDetails = 'No car selected';
    
    if (selectedCar) {
        carDetails = `
            <div class="summary-row">
                <span class="summary-label">Car:</span>
                <span class="summary-value">${selectedCar.number_plate} (${selectedCar.category_name})</span>
            </div>
        `;
    }
    
    // Final summary HTML
    const summaryHTML = `
        <div class="summary-section">
            <h3>Trip Details</h3>
            <div class="summary-row">
                <span class="summary-label">Pickup Location:</span>
                <span class="summary-value">${pickupLocation}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Destination:</span>
                <span class="summary-value">${destination}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Pickup Date & Time:</span>
                <span class="summary-value">${formattedDateTime}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Passengers:</span>
                <span class="summary-value">${passengers}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Additional Notes:</span>
                <span class="summary-value">${notes}</span>
            </div>
        </div>
        
        <div class="summary-section">
            <h3>Package Information</h3>
            ${packageDetails}
        </div>
        
        <div class="summary-section">
            <h3>Car Information</h3>
            ${carDetails}
        </div>
        
        <div class="summary-section">
            <h3>Price Breakdown</h3>
            ${priceDetails}
            <div class="total-row">
                <span>Total Amount:</span>
                <span>Rs. ${totalPrice.toFixed(2)}</span>
            </div>
            <div class="info-text">
                Note: Final price may vary based on actual distance traveled and waiting time.
            </div>
        </div>
    `;
    
    summaryContainer.innerHTML = summaryHTML;
}

/**
 * Validate current step before proceeding
 * @param {number} step - Current step to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateStep(step) {
    switch (step) {
        case 1:
            // Validate location details
            return validateLocationDetails();
        case 2:
            // Validate package selection
            return selectedPackage !== null;
        case 3:
            // Validate car selection
            return selectedCar !== null;
        default:
            return true;
    }
}

/**
 * Validate location details
 * @returns {boolean} - True if valid, false otherwise
 */
function validateLocationDetails() {
    let isValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    document.querySelectorAll('.error-message').forEach(message => {
        message.remove();
    });
    
    // Validate pickup location
    const pickupLocation = document.getElementById('pickupLocation');
    if (!pickupLocation.value.trim()) {
        isValid = false;
        addErrorToField(pickupLocation, 'Pickup location is required');
    }
    
    // Validate destination
    const destination = document.getElementById('destination');
    if (!destination.value.trim()) {
        isValid = false;
        addErrorToField(destination, 'Destination is required');
    }
    
    // Validate pickup date
    const pickupDate = document.getElementById('pickupDate');
    if (!pickupDate.value) {
        isValid = false;
        addErrorToField(pickupDate, 'Pickup date is required');
    } else {
        // Make sure date is not in the past
        const selectedDate = new Date(pickupDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            addErrorToField(pickupDate, 'Pickup date cannot be in the past');
        }
    }
    
    // Validate pickup time
    const pickupTime = document.getElementById('pickupTime');
    if (!pickupTime.value) {
        isValid = false;
        addErrorToField(pickupTime, 'Pickup time is required');
    }
    
    // Validate passengers
    const passengers = document.getElementById('passengers');
    if (!passengers.value || passengers.value < 1) {
        isValid = false;
        addErrorToField(passengers, 'At least 1 passenger is required');
    }
    
    return isValid;
}

/**
 * Add error message to a form field
 * @param {HTMLElement} field - Field to add error to
 * @param {string} message - Error message
 */
function addErrorToField(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

/**
 * Go to next step
 */
function nextStep() {
    if (currentStep < totalSteps) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Increment step
        currentStep++;
        
        // Load cars if moving to car selection step
        if (currentStep === 3) {
            loadCars();
        }
        
        // Update summary if moving to confirmation step
        if (currentStep === 4) {
            updateBookingSummary();
        }
        
        // Show next step
        showStep(currentStep);
        
        // Update progress
        updateProgress(currentStep);
    }
}

/**
 * Go to previous step
 */
function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Decrement step
        currentStep--;
        
        // Show previous step
        showStep(currentStep);
        
        // Update progress
        updateProgress(currentStep);
    }
}

/**
 * Show a specific step
 * @param {number} step - Step number to show
 */
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show the target step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update next button state
    updateNextButton();
}

/**
 * Update progress bar
 * @param {number} step - Current step
 */
function updateProgress(step) {
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        // Add +1 to index because steps are 1-indexed
        const stepNum = index + 1;
        
        if (stepNum < step) {
            // Previous steps are completed
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (stepNum === step) {
            // Current step is active
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            // Future steps are neither active nor completed
            stepEl.classList.remove('active', 'completed');
        }
    });
}

/**
 * Submit booking to the API
 */
function submitBooking() {
    // Get form data
    const bookingData = {
        user_id: parseInt(userId),
        package_id: selectedPackage.package_id,
        car_id: selectedCar.id,
        pickup_location: document.getElementById('pickupLocation').value,
        destination: document.getElementById('destination').value,
        pickup_datetime: `${document.getElementById('pickupDate').value} ${document.getElementById('pickupTime').value}`,
        num_passengers: parseInt(document.getElementById('passengers').value),
        notes: document.getElementById('notes').value,
        status: 'Pending' // Initial status
    };
    
    // Show loading state
    const confirmBtn = document.getElementById('confirmBookingBtn');
    const originalBtnText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Send booking request to API
    fetch(BOOKINGS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create booking');
        }
        return response.json();
    })
    .then(data => {
        // Show success screen
        showBookingSuccess(data.booking_id);
    })
    .catch(error => {
        console.error('Error creating booking:', error);
        alert(`Error: ${error.message}`);
        
        // Reset button
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalBtnText;
    });
}

/**
 * Show booking success screen
 * @param {string} bookingId - Booking reference ID
 */
function showBookingSuccess(bookingId) {
    // Hide the booking steps and progress
    document.querySelector('.booking-progress').style.display = 'none';
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show success message
    const successHtml = `
        <div class="booking-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking has been successfully created.</p>
            <div class="booking-reference">
                Booking Reference: ${bookingId}
            </div>
            <p>A confirmation email has been sent to your registered email address.</p>
            <p>You can view your booking details in your account dashboard.</p>
            <div style="margin-top: 2rem;">
                <a href="customerDashboard.jsp" class="btn btn-primary">
                    <i class="fas fa-home"></i> Go to Dashboard
                </a>
            </div>
        </div>
    `;
    
    const bookingContainer = document.querySelector('.booking-container');
    bookingContainer.innerHTML = successHtml;
}
