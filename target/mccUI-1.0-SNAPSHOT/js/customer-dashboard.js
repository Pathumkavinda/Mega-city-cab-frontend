/**
 * customer-dashboard.js - JavaScript for Customer Dashboard with Bootstrap
 * Created on: Mar 11, 2025
 */

// Global variables
let userId = null;
let userDetails = null;
let userBookings = [];
let paymentMethods = [];
let selectedBookingId = null;

// Bootstrap components
let toastElement;
let bookingModal;
let confirmModal;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;
const PAYMENT_METHODS_ENDPOINT = `${API_BASE_URL}/payment-methods`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    initializeBootstrapComponents();
    
    // Check if user is logged in
    checkUserLogin();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize Bootstrap components
 */
function initializeBootstrapComponents() {
    // Initialize toasts
    toastElement = document.getElementById('toastNotification');
    if (toastElement) {
        toastElement = new bootstrap.Toast(toastElement);
    }
    
    // Initialize modals
    bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
}

/**
 * Check if user is logged in
 */
function checkUserLogin() {
    // Get user ID from session storage
    userId = sessionStorage.getItem('userId');
    
    // If not logged in, redirect to login page
    if (!userId) {
        window.location.href = '../login.jsp';
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Load bookings
    loadBookings();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Tab navigation via URL hash (for direct links)
    if (window.location.hash) {
        const tabName = window.location.hash.substring(1).split('-')[0];
        if (tabName) {
            switchTab(tabName);
        }
    }
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Booking filter
    document.getElementById('bookingFilter').addEventListener('change', function() {
        filterBookings(this.value);
    });
    
    // Profile form buttons
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        enableProfileEditing();
    });
    
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        disableProfileEditing();
    });
    
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
    
    // Password form submission
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updatePassword();
    });
    
    // Payment method buttons
    document.getElementById('addPaymentBtn').addEventListener('click', function() {
        showPaymentForm();
    });
    
    document.getElementById('cancelCardBtn').addEventListener('click', function() {
        hidePaymentForm();
    });
    
    // Add payment form submission
    document.getElementById('addPaymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addPaymentMethod();
    });
    
    // Cancel booking button
    document.getElementById('cancelBookingBtn').addEventListener('click', function() {
        confirmModal.show();
        document.getElementById('confirmMessage').textContent = 'Are you sure you want to cancel this booking?';
        document.getElementById('confirmActionBtn').onclick = function() {
            cancelBooking();
            confirmModal.hide();
        };
    });
    
    // Initialize input formatting for card details
    if (document.getElementById('cardNumber')) {
        document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    }
    
    if (document.getElementById('expiryDate')) {
        document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
    }
    
    if (document.getElementById('cvv')) {
        document.getElementById('cvv').addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '').substring(0, 4);
        });
    }
}

/**
 * Load user data from the API
 */
function loadUserData() {
    fetch(`${USERS_ENDPOINT}/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load user data');
            }
            return response.json();
        })
        .then(data => {
            userDetails = data;
            updateUserInfo();
            loadPaymentMethods(); // Load payment methods after user data
        })
        .catch(error => {
            console.error('Error loading user data:', error);
            showToast('Error', `Failed to load user data: ${error.message}`, 'error');
        });
}

/**
 * Update UI with user information
 */
function updateUserInfo() {
    if (!userDetails) return;
    
    // Update header username and initials
    document.getElementById('customerName').textContent = userDetails.fullName || 'User';
    document.getElementById('navUsername').textContent = userDetails.username || 'User';
    
    const initials = getInitials(userDetails.fullName || userDetails.username || 'User');
    document.getElementById('userInitials').textContent = initials;
    
    // Update profile form
    document.getElementById('fullName').value = userDetails.fullName || '';
    document.getElementById('username').value = userDetails.username || '';
    document.getElementById('email').value = userDetails.uEmail || '';
    document.getElementById('phone').value = userDetails.phone || '';
    document.getElementById('nic').value = userDetails.nic_number || '';
    document.getElementById('address').value = userDetails.address || '';
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
 * Load user bookings from the API
 */
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    // Show loading indicator
    bookingsList.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your bookings...</p>
        </div>
    `;
    
    fetch(`${BOOKINGS_ENDPOINT}?userId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load bookings');
            }
            return response.json();
        })
        .then(data => {
            userBookings = Array.isArray(data) ? data : [];
            renderBookings();
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle text-danger"></i>
                    <h4>Failed to Load Bookings</h4>
                    <p class="text-muted">We encountered an error while loading your bookings. Please try again later.</p>
                    <button class="btn btn-primary mt-3" onclick="loadBookings()">Try Again</button>
                </div>
            `;
        });
}

/**
 * Render bookings in the UI
 * @param {string} filter - Optional filter (all, upcoming, completed, cancelled)
 */
function renderBookings(filter = 'all') {
    const bookingsList = document.getElementById('bookingsList');
    
    // Apply filter
    let filteredBookings = userBookings;
    if (filter !== 'all') {
        if (filter === 'upcoming') {
            filteredBookings = userBookings.filter(booking => 
                booking.status === 'Pending' || booking.status === 'Confirmed' || booking.status === 'In Progress');
        } else if (filter === 'completed') {
            filteredBookings = userBookings.filter(booking => booking.status === 'Completed');
        } else if (filter === 'cancelled') {
            filteredBookings = userBookings.filter(booking => booking.status === 'Cancelled');
        }
    }
    
    // Check if there are bookings to display
    if (!filteredBookings || filteredBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-taxi text-muted"></i>
                <h4>No Bookings Found</h4>
                <p class="text-muted">You don't have any bookings yet.</p>
                <a href="../customer/booking.jsp" class="btn btn-primary mt-3">
                    <i class="fas fa-plus me-2"></i>Book a Ride
                </a>
            </div>
        `;
        return;
    }
    
    // Clear container
    bookingsList.innerHTML = '';
    
    // Sort bookings by pickup date (newest first)
    filteredBookings.sort((a, b) => {
        const dateA = new Date(a.pickup_datetime);
        const dateB = new Date(b.pickup_datetime);
        return dateB - dateA;
    });
    
    // Render each booking
    filteredBookings.forEach(booking => {
        // Format date
        const pickupDate = new Date(booking.pickup_datetime);
        const formattedDate = pickupDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const formattedTime = pickupDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Determine status class
        const statusClass = booking.status.toLowerCase().replace(' ', '-');
        
        // Create booking item element
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item fade-in';
        
        // Generate HTML
        bookingItem.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="booking-id">Booking #${booking.booking_id}</span>
                            <h5 class="mb-1">${formattedDate} - ${formattedTime}</h5>
                        </div>
                        <span class="booking-status ${statusClass}">${booking.status}</span>
                    </div>
                    
                    <div class="booking-locations">
                        <div class="location-point">
                            <div class="location-label">PICKUP</div>
                            <div class="location-address">${booking.pickup_location}</div>
                        </div>
                        <div class="location-point destination">
                            <div class="location-label">DESTINATION</div>
                            <div class="location-address">${booking.destination}</div>
                        </div>
                    </div>
                    
                    <div class="d-flex text-muted small mb-2">
                        <div class="me-3">
                            <i class="fas fa-box me-1"></i> ${booking.package_name || 'Standard'}
                        </div>
                        <div>
                            <i class="fas fa-car me-1"></i> ${booking.car_number_plate || 'Not assigned'}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 d-flex flex-column justify-content-between align-items-end">
                    <div class="text-end mb-auto">
                        <div class="text-primary fw-bold mb-1">Rs. ${parseFloat(booking.total_fare || booking.base_fare || 0).toFixed(2)}</div>
                        ${booking.driver_name ? `<div class="small text-muted">Driver: ${booking.driver_name}</div>` : ''}
                    </div>
                    
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewBookingDetails(${booking.booking_id})">
                            <i class="fas fa-eye me-1"></i> View Details
                        </button>
                        ${booking.status === 'Pending' ? `
                        <button class="btn btn-outline-danger btn-sm ms-2" onclick="promptCancelBooking(${booking.booking_id})">
                            <i class="fas fa-times me-1"></i> Cancel
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        bookingsList.appendChild(bookingItem);
    });
}

/**
 * Filter bookings based on selected filter
 * @param {string} filter - Filter value
 */
function filterBookings(filter) {
    renderBookings(filter);
}

/**
 * View booking details
 * @param {number} bookingId - Booking ID
 */
function viewBookingDetails(bookingId) {
    selectedBookingId = bookingId;
    
    // Find the booking
    const booking = userBookings.find(b => b.booking_id === bookingId);
    if (!booking) return;
    
    const bookingDetails = document.getElementById('bookingDetails');
    
    // Format dates
    const pickupDate = new Date(booking.pickup_datetime);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedPickupTime = pickupDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format price
    const basePrice = parseFloat(booking.base_fare || 0).toFixed(2);
    const extraCharge = parseFloat(booking.extra_distance_charge || 0).toFixed(2);
    const waitingCharge = parseFloat(booking.waiting_charge || 0).toFixed(2);
    const totalPrice = parseFloat(booking.total_fare || booking.base_fare || 0).toFixed(2);
    
    // Determine if the booking can be cancelled
    const canCancel = booking.status === 'Pending';
    
    // Modal content
    bookingDetails.innerHTML = `
        <div class="mb-4">
            <span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span>
            <h4 class="mt-2">${formattedPickupDate} at ${formattedPickupTime}</h4>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <h5 class="fw-bold">Trip Details</h5>
                <div class="route-display">
                    <div class="booking-locations mb-0">
                        <div class="location-point">
                            <div class="location-label">PICKUP LOCATION</div>
                            <div class="location-address fw-medium">${booking.pickup_location}</div>
                        </div>
                        <div class="location-point destination">
                            <div class="location-label">DESTINATION</div>
                            <div class="location-address fw-medium">${booking.destination}</div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="fw-medium">Package</div>
                            <div>${booking.package_name || 'Standard'} (${booking.category_name})</div>
                        </div>
                        <div class="col-6">
                            <div class="fw-medium">Passengers</div>
                            <div>${booking.num_passengers}</div>
                        </div>
                        <div class="col-6">
                            <div class="fw-medium">Car</div>
                            <div>${booking.car_number_plate || 'Not assigned yet'}</div>
                        </div>
                        <div class="col-6">
                            <div class="fw-medium">Driver</div>
                            <div>${booking.driver_name || 'Not assigned yet'}</div>
                        </div>
                    </div>
                </div>
                
                ${booking.notes ? `
                <div class="mt-3">
                    <div class="fw-medium">Notes</div>
                    <p class="mb-0">${booking.notes}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="col-md-6">
                <h5 class="fw-bold">Fare Details</h5>
                <div class="price-summary">
                    <div class="price-row">
                        <div>Base Fare</div>
                        <div>Rs. ${basePrice}</div>
                    </div>
                    ${parseFloat(extraCharge) > 0 ? `
                    <div class="price-row">
                        <div>Extra Distance Charge</div>
                        <div>Rs. ${extraCharge}</div>
                    </div>
                    ` : ''}
                    ${parseFloat(waitingCharge) > 0 ? `
                    <div class="price-row">
                        <div>Waiting Charge</div>
                        <div>Rs. ${waitingCharge}</div>
                    </div>
                    ` : ''}
                    <div class="price-row price-total">
                        <div>Total</div>
                        <div>Rs. ${totalPrice}</div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5 class="fw-bold">Payment Information</h5>
                    <div class="table-responsive">
                        <table class="table table-in-card">
                            <tbody>
                                <tr>
                                    <th scope="row">Payment Status</th>
                                    <td class="text-end">${booking.payment_status || 'Pending'}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Payment Method</th>
                                    <td class="text-end">${booking.payment_method || 'Not specified'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show or hide cancel button
    const cancelBtn = document.getElementById('cancelBookingBtn');
    cancelBtn.style.display = canCancel ? 'block' : 'none';
    
    // Show modal
    bookingModal.show();
}

/**
 * Get Bootstrap contextual class for status
 * @param {string} status - Booking status
 * @returns {string} - Bootstrap color class
 */
function getStatusColor(status) {
    switch (status) {
        case 'Pending': return 'warning';
        case 'Confirmed': return 'info';
        case 'In Progress': return 'primary';
        case 'Completed': return 'success';
        case 'Cancelled': return 'danger';
        default: return 'secondary';
    }
}

/**
 * Prompt to cancel a booking
 * @param {number} bookingId - Booking ID to cancel
 */
function promptCancelBooking(bookingId) {
    selectedBookingId = bookingId;
    
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to cancel this booking?';
    document.getElementById('confirmActionBtn').onclick = function() {
        cancelBooking();
        confirmModal.hide();
    };
    
    confirmModal.show();
}

/**
 * Cancel a booking
 */
function cancelBooking() {
    if (!selectedBookingId) return;
    
    fetch(`${BOOKINGS_ENDPOINT}/${selectedBookingId}/cancel`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }
        return response.json();
    })
    .then(data => {
        // Close modals
        bookingModal.hide();
        
        // Show success message
        showToast('Booking Cancelled', 'Your booking has been successfully cancelled.', 'success');
        
        // Reload bookings
        loadBookings();
    })
    .catch(error => {
        console.error('Error cancelling booking:', error);
        showToast('Error', `Failed to cancel booking: ${error.message}`, 'error');
    });
}

/**
 * Enable profile editing
 */
function enableProfileEditing() {
    const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
    formInputs.forEach(input => {
        if (input.id !== 'username' && input.id !== 'email' && input.id !== 'nic') {
            input.disabled = false;
        }
    });
    
    document.getElementById('profileFormActions').style.display = 'block';
    document.getElementById('editProfileBtn').style.display = 'none';
}

/**
 * Disable profile editing
 */
function disableProfileEditing() {
    const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
    formInputs.forEach(input => {
        input.disabled = true;
    });
    
    document.getElementById('profileFormActions').style.display = 'none';
    document.getElementById('editProfileBtn').style.display = 'block';
    
    // Reset form values
    updateUserInfo();
}

/**
 * Update user profile
 */
function updateProfile() {
    const updatedProfile = {
        id: userId,
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };
    
    fetch(`${USERS_ENDPOINT}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        // Update local user details
        userDetails = { ...userDetails, ...updatedProfile };
        
        // Disable editing
        disableProfileEditing();
        
        // Show success message
        showToast('Profile Updated', 'Your profile has been successfully updated.', 'success');
        
        // Update UI
        updateUserInfo();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showToast('Error', `Failed to update profile: ${error.message}`, 'error');
    });
}

/**
 * Update user password
 */
function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password match
    if (newPassword !== confirmPassword) {
        showToast('Password Error', 'New passwords do not match.', 'error');
        return;
    }
    
    // Prepare password update data
    const passwordData = {
        currentPassword,
        newPassword
    };
    
    fetch(`${USERS_ENDPOINT}/${userId}/update-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update password');
        }
        return response.json();
    })
    .then(data => {
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Show success message
        showToast('Password Updated', 'Your password has been successfully updated.', 'success');
    })
    .catch(error => {
        console.error('Error updating password:', error);
        showToast('Error', `Failed to update password: ${error.message}`, 'error');
    });
}

/**
 * Load payment methods - NOTE: This is a mock implementation
 * In a real application, this would fetch from an API
 */
function loadPaymentMethods() {
    // Mock data
    paymentMethods = [
        {
            id: 1,
            type: 'visa',
            cardNumber: '**** **** **** 1234',
            expiryDate: '12/25',
            cardholderName: 'John Doe'
        }
    ];
    
    renderPaymentMethods();
}

/**
 * Render payment methods in the UI
 */
function renderPaymentMethods() {
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    
    // Check if there are payment methods to display
    if (!paymentMethods || paymentMethods.length === 0) {
        paymentMethodsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-credit-card display-1 text-muted mb-3"></i>
                <h4>No Payment Methods</h4>
                <p class="text-muted">You don't have any saved payment methods yet.</p>
                <p class="text-muted">Add a payment method to make booking faster.</p>
            </div>
        `;
        return;
    }
    
    // Clear container
    paymentMethodsList.innerHTML = '';
    
    // Render each payment method
    paymentMethods.forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'card payment-card mb-3 fade-in';
        
        methodCard.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <i class="fab fa-cc-${method.type} card-icon ${method.type}"></i>
                    <div>
                        <h6 class="mb-1">${method.cardholderName}</h6>
                        <div class="text-muted">${method.cardNumber}</div>
                        <div class="small text-muted">Expires ${method.expiryDate}</div>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removePaymentMethod(${method.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        paymentMethodsList.appendChild(methodCard);
    });
}

/**
 * Show payment method form
 */
function showPaymentForm() {
    document.getElementById('paymentForm').style.display = 'block';
    document.getElementById('addPaymentBtn').style.display = 'none';
}

/**
 * Hide payment method form
 */
function hidePaymentForm() {
    document.getElementById('paymentForm').style.display = 'none';
    document.getElementById('addPaymentBtn').style.display = 'block';
    document.getElementById('addPaymentForm').reset();
}

/**
 * Add a new payment method - NOTE: This is a mock implementation
 * In a real application, this would send to an API
 */
function addPaymentMethod() {
    const cardType = document.getElementById('cardType').value;
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    
    // Create a new payment method (mock)
    const newMethod = {
        id: paymentMethods.length + 1,
        type: cardType,
        cardNumber: '**** **** **** ' + cardNumber.slice(-4),
        expiryDate: expiryDate,
        cardholderName: cardName
    };
    
    // Add to local array
    paymentMethods.push(newMethod);
    
    // Update UI
    renderPaymentMethods();
    
    // Hide form
    hidePaymentForm();
    
    // Show success message
    showToast('Payment Method Added', 'Your payment method has been successfully added.', 'success');
}

/**
 * Remove a payment method - NOTE: This is a mock implementation
 * In a real application, this would send to an API
 */
function removePaymentMethod(methodId) {
    // Show confirmation dialog
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to remove this payment method?';
    document.getElementById('confirmActionBtn').onclick = function() {
        // Filter out the removed method
        paymentMethods = paymentMethods.filter(method => method.id !== methodId);
        
        // Update UI
        renderPaymentMethods();
        
        // Show success message
        showToast('Payment Method Removed', 'Your payment method has been successfully removed.', 'success');
        
        // Hide modal
        confirmModal.hide();
    };
    
    confirmModal.show();
}

/**
 * Switch active tab
 * @param {string} tabId - Tab ID to activate
 */
function switchTab(tabId) {
    // Activate the tab via Bootstrap Tab API
    const tabEl = document.querySelector(`#${tabId}-tab-btn`);
    if (tabEl) {
        const tab = new bootstrap.Tab(tabEl);
        tab.show();
    }
    
    // Load tab-specific data
    if (tabId === 'payment') {
        loadPaymentMethods();
    }
}

/**
 * Show toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showToast(title, message, type = 'success') {
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toast = document.getElementById('toastNotification');
    
    // Set content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set color based on type
    toast.className = 'toast';
    
    switch (type) {
        case 'success':
            toast.classList.add('text-bg-success');
            break;
        case 'error':
            toast.classList.add('text-bg-danger');
            break;
        case 'warning':
            toast.classList.add('text-bg-warning');
            break;
        case 'info':
            toast.classList.add('text-bg-info');
            break;
        default:
            toast.classList.add('text-bg-primary');
    }
    
    // Show the toast
    toastElement.show();
}

/**
 * Format card number input with spaces
 * @param {Event} e - Input event
 */
function formatCardNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Limit to 16 digits
    if (value.length > 16) {
        value = value.substr(0, 16);
    }
    
    // Add spaces after every 4 digits
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
        parts.push(value.substr(i, 4));
    }
    
    input.value = parts.join(' ');
}

/**
 * Format expiry date input (MM/YY)
 * @param {Event} e - Input event
 */
function formatExpiryDate(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 4) {
        value = value.substr(0, 4);
    }
    
    // Format as MM/YY
    if (value.length > 2) {
        input.value = value.substr(0, 2) + '/' + value.substr(2);
    } else {
        input.value = value;
    }
}

/**
 * Log the user out
 */
function logout() {
    // Clear session storage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    
    // Redirect to login page
    window.location.href = '../login.jsp';
}
