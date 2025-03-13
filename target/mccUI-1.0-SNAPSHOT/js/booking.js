/* 
 * MegacityCabs - Booking JavaScript
 * Handles the booking form functionality for customers
 */

/**
 * Initialize the page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // First validate user session
    if (!validateUserSession()) {
        return; // Stop if session validation fails
    }
    
    // Check if we're on the booking page
    if (window.location.pathname.includes('addBooking.jsp')) {
        initializeBookingForm();
    }
});

/**
 * Initialize the booking form with defaults and event listeners
 */
function initializeBookingForm() {
    console.log('Initializing booking form...');
    
    // Set default values for date and time
    setDefaultDateTime();
    
    // Load package types
    loadPackages();
    
    // Set up form submission handler
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateBookingForm()) {
                submitBooking();
            }
        });
    }
    
    // Add validation styles
    addValidationStyles();
    
    // Create error and success message containers if they don't exist
    if (!document.getElementById('error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        const formContainer = document.querySelector('.form-container') || bookingForm;
        if (formContainer) {
            formContainer.insertBefore(errorDiv, formContainer.firstChild);
        }
    }
    
    if (!document.getElementById('success-message')) {
        const successDiv = document.createElement('div');
        successDiv.id = 'success-message';
        const formContainer = document.querySelector('.form-container') || bookingForm;
        if (formContainer) {
            formContainer.insertBefore(successDiv, formContainer.firstChild);
        }
    }
}

/**
 * Set default date (today) and time (current time + 1 hour)
 */
function setDefaultDateTime() {
    const pickupDateInput = document.getElementById('pickup-date');
    const pickupTimeInput = document.getElementById('pickup-time');
    
    if (pickupDateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        pickupDateInput.min = formattedDate; // Can't select dates in the past
        pickupDateInput.value = formattedDate;
    }
    
    if (pickupTimeInput) {
        const now = new Date();
        now.setHours(now.getHours() + 1); // Add 1 hour to current time
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to nearest 15 min
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        pickupTimeInput.value = `${hours}:${minutes}`;
    }
}

/**
 * Load package types from the API
 */
function loadPackages() {
    const packageSelect = document.getElementById('vehicle-type');
    if (!packageSelect) {
        console.error("Could not find package select element with id 'vehicle-type'");
        return;
    }
    
    // Set loading state
    packageSelect.innerHTML = '<option value="">Loading packages...</option>';
    packageSelect.disabled = true;
    
    console.log("Fetching packages from API...");
    
    // Fetch packages from API
    fetch('http://localhost:8080/mccAPI/api/packages')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load packages: ${response.status}`);
            }
            return response.json();
        })
        .then(packages => {
            console.log("Packages loaded successfully:", packages);
            
            // Clear loading state
            packageSelect.innerHTML = '<option value="">Select a package</option>';
            
            // Add packages to select dropdown
            packages.forEach(pkg => {
                const option = document.createElement('option');
                option.value = pkg.package_id.toString(); // Ensure string conversion
                
                // Create descriptive option text including package type and pricing
                let optionText = `${pkg.package_name} (${pkg.category_name})`;
                
                // Add pricing info based on package type
                if (pkg.package_type === 'Day') {
                    optionText += ` - LKR ${pkg.base_price.toFixed(2)} (${pkg.included_kilometers} km)`;
                } else if (pkg.package_type === 'Kilometer') {
                    optionText += ` - LKR ${pkg.per_kilometer_charge.toFixed(2)}/km`;
                }
                
                option.textContent = optionText;
                
                // Store additional data as attributes for fare calculation
                option.dataset.packageType = pkg.package_type;
                option.dataset.basePrice = pkg.base_price;
                option.dataset.perKm = pkg.per_kilometer_charge;
                option.dataset.includedKm = pkg.included_kilometers;
                option.dataset.waitingCharge = pkg.waiting_charge;
                option.dataset.categoryName = pkg.category_name;
                
                packageSelect.appendChild(option);
            });
            
            // Enable select
            packageSelect.disabled = false;
            
            // Set up form listeners for fare estimation
            setupFormListeners();
        })
        .catch(error => {
            console.error('Error loading packages:', error);
            packageSelect.innerHTML = '<option value="">Error loading packages</option>';
            showError('Failed to load packages. Please try again later.');
            
            // Add fallback packages if API fails
            addFallbackPackages(packageSelect);
            
            // Still set up listeners even with fallback data
            setupFormListeners();
        });
}

/**
 * Set up form listeners for calculating fare estimate
 */
function setupFormListeners() {
    const pickupLocation = document.getElementById('pickup-location');
    const destination = document.getElementById('destination');
    const vehicleType = document.getElementById('vehicle-type');
    
    // Add change listeners to update fare estimate
    if (pickupLocation && destination && vehicleType) {
        [pickupLocation, destination, vehicleType].forEach(element => {
            element.addEventListener('change', calculateFareEstimate);
            element.addEventListener('input', calculateFareEstimate);
        });
    }
}

/**
 * Add fallback package options when API fails
 */
function addFallbackPackages(selectElement) {
    console.log("Adding fallback package options");
    
    const fallbackPackages = [
        { 
            id: 1, 
            name: "Economy Day Package", 
            type: "Day",
            category: "Economy",
            basePrice: 20000,
            includedKm: 250,
            perKm: 60,
            waitingCharge: 300
        },
        { 
            id: 2, 
            name: "Economy Kilometer Package", 
            type: "Kilometer",
            category: "Economy",
            basePrice: 100,
            includedKm: 0,
            perKm: 100,
            waitingCharge: 150
        },
        { 
            id: 3, 
            name: "Premium Day Package", 
            type: "Day",
            category: "Premium",
            basePrice: 32000,
            includedKm: 250,
            perKm: 80,
            waitingCharge: 400
        },
        { 
            id: 4, 
            name: "Premium Kilometer Package", 
            type: "Kilometer",
            category: "Premium",
            basePrice: 150,
            includedKm: 0,
            perKm: 150,
            waitingCharge: 250
        }
    ];
    
    fallbackPackages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id.toString(); // Ensure string conversion
        
        let optionText = `${pkg.name} (${pkg.category})`;
        if (pkg.type === 'Day') {
            optionText += ` - LKR ${pkg.basePrice.toFixed(2)} (${pkg.includedKm} km)`;
        } else {
            optionText += ` - LKR ${pkg.perKm.toFixed(2)}/km`;
        }
        
        option.textContent = optionText;
        
        // Store data for fare calculation
        option.dataset.packageType = pkg.type;
        option.dataset.basePrice = pkg.basePrice;
        option.dataset.perKm = pkg.perKm;
        option.dataset.includedKm = pkg.includedKm;
        option.dataset.waitingCharge = pkg.waitingCharge;
        option.dataset.categoryName = pkg.category;
        
        selectElement.appendChild(option);
    });
    
    selectElement.disabled = false;
}

/**
 * Calculate and display fare estimate based on selections
 */
function calculateFareEstimate() {
    const pickupLocation = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    const vehicleType = document.getElementById('vehicle-type');
    const fareEstimateDiv = document.getElementById('fare-estimate');
    
    // Check if we have enough information
    if (!pickupLocation || !destination || !vehicleType.value || !fareEstimateDiv) {
        return;
    }
    
    // Get selected package information
    const selectedOption = vehicleType.options[vehicleType.selectedIndex];
    if (!selectedOption.dataset.packageType) {
        return;
    }
    
    const packageType = selectedOption.dataset.packageType;
    const basePrice = parseFloat(selectedOption.dataset.basePrice);
    const perKmRate = parseFloat(selectedOption.dataset.perKm);
    const includedKm = parseInt(selectedOption.dataset.includedKm);
    const waitingCharge = parseFloat(selectedOption.dataset.waitingCharge);
    const categoryName = selectedOption.dataset.categoryName;
    
    // Calculate estimated distance between locations
    const estimatedDistance = calculateSimulatedDistance(pickupLocation, destination);
    
    // Calculate estimated waiting time (in minutes)
    const estimatedWaitingTime = Math.floor(Math.random() * 30); // 0-30 minutes
    
    // Calculate estimated fare based on package type
    let estimatedFare = 0;
    let fareDetails = '';
    
    if (packageType === 'Day') {
        estimatedFare = basePrice;
        
        // Add extra distance charge if applicable
        const extraKm = Math.max(0, estimatedDistance - includedKm);
        const extraDistanceCharge = extraKm * perKmRate;
        
        // Add waiting charge if applicable
        const extraWaitingCharge = estimatedWaitingTime > 0 ? 
            (estimatedWaitingTime / 60) * waitingCharge : 0;
        
        // Total fare with extras
        const totalWithExtras = estimatedFare + extraDistanceCharge + extraWaitingCharge;
        
        fareDetails = `
            <p class="fare-detail"><strong>Base package price:</strong> LKR ${basePrice.toFixed(2)}</p>
            <p class="fare-detail"><strong>Category:</strong> ${categoryName}</p>
            <p class="fare-detail"><strong>Package type:</strong> ${packageType}</p>
            <p class="fare-detail"><strong>Estimated distance:</strong> ${estimatedDistance.toFixed(1)} km</p>
            <p class="fare-detail"><strong>Included kilometers:</strong> ${includedKm} km</p>
            
            ${extraKm > 0 ? `
            <p class="fare-detail"><strong>Extra distance:</strong> ${extraKm.toFixed(1)} km × LKR ${perKmRate.toFixed(2)} = LKR ${extraDistanceCharge.toFixed(2)}</p>
            ` : ''}
            
            ${estimatedWaitingTime > 0 ? `
            <p class="fare-detail"><strong>Estimated waiting:</strong> ${estimatedWaitingTime} min (LKR ${extraWaitingCharge.toFixed(2)})</p>
            ` : ''}
            
            ${(extraKm > 0 || estimatedWaitingTime > 0) ? `
            <div class="fare-total">
                <p><strong>Total estimated fare:</strong> LKR ${totalWithExtras.toFixed(2)}</p>
            </div>
            ` : ''}
            
            <p class="fare-note">Note: Final fare may vary based on actual distance traveled and waiting time.</p>
        `;
        
        // Set final estimated fare
        estimatedFare = totalWithExtras;
    } else if (packageType === 'Kilometer') {
        // Calculate kilometer-based fare
        const distanceCharge = estimatedDistance * perKmRate;
        
        // Add waiting charge if applicable
        const extraWaitingCharge = estimatedWaitingTime > 0 ? 
            (estimatedWaitingTime / 60) * waitingCharge : 0;
        
        // Total fare
        const totalFare = distanceCharge + extraWaitingCharge;
        
        fareDetails = `
            <p class="fare-detail"><strong>Category:</strong> ${categoryName}</p>
            <p class="fare-detail"><strong>Package type:</strong> ${packageType}</p>
            <p class="fare-detail"><strong>Estimated distance:</strong> ${estimatedDistance.toFixed(1)} km</p>
            <p class="fare-detail"><strong>Rate per km:</strong> LKR ${perKmRate.toFixed(2)}</p>
            <p class="fare-detail"><strong>Distance charge:</strong> ${estimatedDistance.toFixed(1)} km × LKR ${perKmRate.toFixed(2)} = LKR ${distanceCharge.toFixed(2)}</p>
            
            ${estimatedWaitingTime > 0 ? `
            <p class="fare-detail"><strong>Estimated waiting:</strong> ${estimatedWaitingTime} min (LKR ${extraWaitingCharge.toFixed(2)})</p>
            ` : ''}
            
            <div class="fare-total">
                <p><strong>Total estimated fare:</strong> LKR ${totalFare.toFixed(2)}</p>
            </div>
            
            <p class="fare-note">Note: Final fare may vary based on actual distance traveled and waiting time.</p>
        `;
        
        // Set final estimated fare
        estimatedFare = totalFare;
    }
    
    // Update the fare estimate display
    fareEstimateDiv.innerHTML = `
        <h3>Fare Estimate</h3>
        <div class="fare-amount">LKR ${estimatedFare.toFixed(2)}</div>
        <div class="fare-details">
            ${fareDetails}
        </div>
    `;
    
    // Store the estimated fare and distance for later use in booking
    const form = document.getElementById('booking-form');
    if (form) {
        form.dataset.estimatedFare = estimatedFare.toFixed(2);
        form.dataset.estimatedDistance = estimatedDistance.toFixed(1);
        form.dataset.estimatedWaitingTime = estimatedWaitingTime;
    }
}

/**
 * Calculate a simulated distance between two locations
 */
function calculateSimulatedDistance(origin, destination) {
    // Use the length of the addresses to create a somewhat realistic distance
    const originLength = origin.length;
    const destLength = destination.length;
    
    // Base distance between 5-15 km
    const baseDistance = 5 + (Math.random() * 10);
    
    // Add some variation based on the address lengths
    const variation = ((originLength + destLength) % 10) / 2;
    
    return baseDistance + variation;
}

/**
 * Validate user session
 * @returns {boolean} true if session is valid, false otherwise
 */
function validateUserSession() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user session found, redirecting to login page');
        window.location.href = '../login.jsp';
        return false;
    }
    return true;
}

/**
 * Submit the booking to the API
 */
function submitBooking() {
    // Get form values
    const pickupLocation = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const packageId = document.getElementById('vehicle-type').value;
    const passengers = document.getElementById('passengers').value || 1;
    const notes = document.getElementById('notes') ? document.getElementById('notes').value : '';
    
    // Debug the package selection
    const packageSelect = document.getElementById('vehicle-type');
    const selectedPackage = packageSelect.options[packageSelect.selectedIndex];
    console.log('Selected package:', {
        id: packageSelect.value,
        idType: typeof packageSelect.value,
        name: selectedPackage.textContent,
        packageType: selectedPackage.dataset.packageType,
        basePrice: selectedPackage.dataset.basePrice
    });
    
    // Get the user ID from session
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('Session expired. Please log in again.');
        window.location.href = '../login.jsp';
        return;
    }
    
    // Get estimated fare and distance from the form data
    const form = document.getElementById('booking-form');
    const estimatedFare = form && form.dataset.estimatedFare ? parseFloat(form.dataset.estimatedFare) : 0;
    const estimatedDistance = form && form.dataset.estimatedDistance ? parseFloat(form.dataset.estimatedDistance) : 0;
    
    // Format datetime exactly as expected by server (yyyy-MM-dd HH:mm)
    const pickup_datetime = `${pickupDate} ${pickupTime}`;
    
    // Create booking object that matches exactly what the server expects
    const bookingData = {
        user_id: parseInt(userId, 10),
        package_id: parseInt(packageId, 10),
        car_id: null,  // Let server assign car
        pickup_location: pickupLocation,
        destination: destination,
        pickup_datetime: pickup_datetime,
        num_passengers: parseInt(passengers, 10),
        notes: notes,
        status: "Pending",
        price: estimatedFare,
        distance: estimatedDistance
    };
    
    console.log('Submitting booking data:', bookingData);
    
    // Change button state to loading
    const button = document.querySelector('button[type="submit"]');
    if (button) {
        const originalButtonText = button.innerHTML;
        button.innerHTML = 'Processing...';
        button.disabled = true;
        
        // Reset button after 10 seconds no matter what (failsafe)
        setTimeout(() => {
            button.innerHTML = originalButtonText;
            button.disabled = false;
        }, 10000);
    }
    
    // Try XHR method instead of fetch
    submitBookingWithXHR(bookingData, button);
}

/**
 * Submit booking using XMLHttpRequest
 */
function submitBookingWithXHR(bookingData, button) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/mccAPI/api/bookings/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('XHR response status:', xhr.status);
            console.log('XHR response text:', xhr.responseText);
            
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success
                showSuccess('Booking created successfully!');
                
                // Try to parse response
                let responseData;
                try {
                    responseData = JSON.parse(xhr.responseText);
                    console.log('Booking response data:', responseData);
                    
                    // If we have booking data, show confirmation
                    if (responseData && responseData.booking_id) {
                        showBookingConfirmation(responseData);
                    }
                } catch (e) {
                    console.warn('Could not parse response as JSON:', e);
                }
                
                // Reset form
                const form = document.getElementById('booking-form');
                if (form) form.reset();
                setDefaultDateTime();
                
                // Redirect after a delay
                setTimeout(() => {
                    window.location.href = 'bookingHistory.jsp';
                }, 3000);
            } else {
                // Error
                let errorMessage = 'Failed to create booking';
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Not JSON or parse error
                    if (xhr.responseText) {
                        errorMessage = xhr.responseText;
                    }
                }
                showError(errorMessage);
                
                // If it's a 400 error, log more details
                if (xhr.status === 400) {
                    console.error('Server validation error. Request data:', bookingData);
                }
            }
            
            // Reset button
            if (button) {
                button.innerHTML = 'Book Now';
                button.disabled = false;
            }
        }
    };
    
    // Handle network errors
    xhr.onerror = function() {
        console.error('Network error occurred');
        showError('Network error. Please check your connection and try again.');
        
        if (button) {
            button.innerHTML = 'Book Now';
            button.disabled = false;
        }
    };
    
    // Send the request
    xhr.send(JSON.stringify(bookingData));
}

/**
 * Show booking confirmation notification
 */
function showBookingConfirmation(bookingData) {
    // Create confirmation modal if it doesn't exist
    if (!document.getElementById('booking-confirmation')) {
        const modal = document.createElement('div');
        modal.id = 'booking-confirmation';
        modal.className = 'booking-confirmation-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Booking Submitted</h3>
                </div>
                <div class="modal-body" id="confirmation-details">
                    <!-- Details will be inserted here -->
                </div>
                <div class="modal-footer">
                    <p>Redirecting to booking history in <span id="countdown">5</span> seconds...</p>
                    <button class="btn-primary" onclick="window.location.href='bookingHistory.jsp'">
                        View My Bookings
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Parse date and time from booking data
    let formattedDate = "Not available";
    let formattedTime = "Not available";
    
    try {
        // Try to format date and time if available
        if (bookingData.pickup_datetime) {
            const pickupDate = new Date(bookingData.pickup_datetime);
            formattedDate = pickupDate.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            formattedTime = pickupDate.toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    } catch (e) {
        console.warn('Error formatting date:', e);
    }
    
    // Populate confirmation details
    const confirmationDetails = document.getElementById('confirmation-details');
    if (confirmationDetails) {
        confirmationDetails.innerHTML = `
            <div class="confirmation-info">
                <p class="booking-id">Booking Reference: <strong>#${bookingData.booking_id}</strong></p>
                <p class="booking-status">Status: <span class="status-badge pending">Pending</span></p>
                
                <div class="booking-details-grid">
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Pickup:</span>
                        <span class="detail-value">${bookingData.pickup_location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-flag-checkered"></i> Destination:</span>
                        <span class="detail-value">${bookingData.destination}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-calendar-alt"></i> Date:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-clock"></i> Time:</span>
                        <span class="detail-value">${formattedTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-money-bill-wave"></i> Estimated Fare:</span>
                        <span class="detail-value">LKR ${bookingData.price ? bookingData.price.toFixed(2) : "N/A"}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-users"></i> Passengers:</span>
                        <span class="detail-value">${bookingData.num_passengers}</span>
                    </div>
                </div>
                
                <div class="confirmation-message">
                    <p><i class="fas fa-info-circle"></i> A driver will be assigned to your booking shortly.</p>
                    <p>You will receive updates about your booking status.</p>
                </div>
            </div>
        `;
    }
    
    // Show the modal
    const modal = document.getElementById('booking-confirmation');
    if (modal) {
        modal.classList.add('show');
        
        // Start countdown
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) countdownElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add shake animation if defined
        if (typeof errorElement.classList.add === 'function') {
            errorElement.classList.add('error-shake');
            setTimeout(() => {
                errorElement.classList.remove('error-shake');
            }, 600);
        }
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    } else {
        // Fallback to alert if error element doesn't exist
        console.error('Error:', message);
        alert(message);
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 5000);
    } else {
        // Fallback to alert if success element doesn't exist
        console.log('Success:', message);
        alert(message);
    }
}

/**
 * Validate the booking form before submission
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateBookingForm() {
    // Get form values
    const pickupLocation = document.getElementById('pickup-location').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const packageId = document.getElementById('vehicle-type').value;
    
    // Check required fields
    if (!pickupLocation) {
        showError('Please enter a pickup location');
        highlightField('pickup-location');
        return false;
    }
    
    if (!destination) {
        showError('Please enter a destination');
        highlightField('destination');
        return false;
    }
    
    if (!pickupDate) {
        showError('Please select a pickup date');
        highlightField('pickup-date');
        return false;
    }
    
    if (!pickupTime) {
        showError('Please select a pickup time');
        highlightField('pickup-time');
        return false;
    }
    
    // Check if a package is selected
    if (!packageId || packageId === "0" || packageId === "") {
        showError('Please select a valid package');
        highlightField('vehicle-type');
        return false;
    }
    
    // Validate date - must be today or future
    const selectedDate = new Date(pickupDate);
    selectedDate.setHours(0, 0, 0, 0); // Reset time component
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time component
    
    if (selectedDate < today) {
        showError('Pickup date cannot be in the past');
        highlightField('pickup-date');
        return false;
    }
    
    // If date is today, validate time - must be at least 1 hour from now
    if (selectedDate.getTime() === today.getTime()) {
        const now = new Date();
        const selectedDateTime = new Date(pickupDate + 'T' + pickupTime);
        
        // Add 1 hour to current time for minimum booking time
        const minTime = new Date(now.getTime() + 60 * 60 * 1000);
        
        if (selectedDateTime < minTime) {
            showError('Pickup time must be at least 1 hour from now');
            highlightField('pickup-time');
            return false;
        }
    }
    
    // Check reasonable distance
    if (pickupLocation === destination) {
        showError('Pickup location and destination cannot be the same');
        highlightField('pickup-location');
        highlightField('destination');
        return false;
    }
    
    // All validations passed
    return true;
}

/**
 * Highlight a field with error styling
 * @param {string} fieldId - ID of the field to highlight
 */
function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error class
    field.classList.add('field-error');
    
    // Remove error class after user interacts with field
    field.addEventListener('input', function onInput() {
        field.classList.remove('field-error');
        field.removeEventListener('input', onInput);
    });
}

/**
 * Add CSS for field validation
 */
function addValidationStyles() {
    // Check if styles already exist
    if (document.getElementById('booking-validation-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'booking-validation-styles';
    style.textContent = `
        .field-error {
            border-color: #f44336 !important;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
        }
        
        .field-error:focus {
            border-color: #f44336 !important;
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.3) !important;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .error-shake {
            animation: shake 0.6s ease-in-out;
        }
        
        #error-message {
            display: none;
            background-color: #ffebee;
            color: #d32f2f;
            padding: 10px 15px;
            border-left: 4px solid #f44336;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        
        #error-message.show {
            display: block;
        }
        
        #success-message {
            display: none;
            background-color: #e8f5e9;
            color: #2e7d32;
            padding: 10px 15px;
            border-left: 4px solid #4caf50;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        
        #success-message.show {
            display: block;
        }
        
        .booking-confirmation-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .booking-confirmation-modal.show {
            display: flex;
        }
        
        .booking-confirmation-modal .modal-content {
            background-color: white;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .booking-confirmation-modal .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            background-color: #f5f5f5;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        
        .booking-confirmation-modal .modal-body {
            padding: 20px;
        }
        
        .booking-confirmation-modal .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #e0e0e0;
            text-align: right;
            background-color: #f5f5f5;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        .fare-detail {
            margin: 5px 0;
        }
        
        .fare-total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e0e0e0;
            font-weight: bold;
        }
        
        .fare-note {
            font-size: 0.9em;
            color: #757575;
            margin-top: 10px;
        }
        
        .fare-amount {
            font-size: 1.5em;
            font-weight: bold;
            color: #2e7d32;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
}