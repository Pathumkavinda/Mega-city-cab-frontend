/**
 * customer.js - Improved JavaScript for Customer Dashboard
 * Created on: Mar 12, 2025
 */

// Configuration
const CONFIG = {
  API_BASE_URL: "http://localhost:8080/mccAPI/api",
  DEFAULT_PAGE: "bookings"
};

// Application state
const AppState = {
  id: null,
  uRole: null,
  uEmail: null,
  userData: {},
  currentPage: null,
  bookings: [],
  paymentMethods: [],
  selectedBookingId: null
};

// Bootstrap components
let toastElement;
let bookingModal;
let confirmModal;

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in and has correct role
  AppState.userId = sessionStorage.getItem('id');
  AppState.userRole = sessionStorage.getItem('uRole');
  AppState.userEmail = sessionStorage.getItem('uEmail');
  AppState.userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  
  // Redirect if not logged in or not a customer
  if (!AppState.userId || AppState.userRole !== 'user') {
    window.location.href = '../login.jsp';
    return;
  }
  
  // Initialize Bootstrap components
  initBootstrapComponents();
  
  // Update user interface with session data
  updateUserInterface();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load default page
  loadPage(CONFIG.DEFAULT_PAGE);
});

/**
 * Initialize Bootstrap components
 */
function initBootstrapComponents() {
  // Initialize toasts
  const toastEl = document.getElementById('toastNotification');
  if (toastEl) {
    toastElement = new bootstrap.Toast(toastEl);
  }
  
  // Initialize modals
  const bookingModalEl = document.getElementById('bookingModal');
  if (bookingModalEl) {
    bookingModal = new bootstrap.Modal(bookingModalEl);
  }
  
  const confirmModalEl = document.getElementById('confirmModal');
  if (confirmModalEl) {
    confirmModal = new bootstrap.Modal(confirmModalEl);
  }
}

/**
 * Update user interface with user data from session storage
 */
function updateUserInterface() {
  // Get user display name
  const userName = AppState.userData.fullName || AppState.userData.name || AppState.userEmail.split('@')[0];
  
  // Update username in navbar and welcome banner
  const navUsernameEl = document.getElementById('navUsername');
  const customerNameEl = document.getElementById('customerName');
  
  if (navUsernameEl) navUsernameEl.textContent = userName;
  if (customerNameEl) customerNameEl.textContent = userName;
  
  // Update user initials for avatar
  const initials = getInitials(userName);
  const userInitialsEl = document.getElementById('userInitials');
  if (userInitialsEl) userInitialsEl.textContent = initials;
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Navigation link clicks
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadPage(page);
      
      // Update active tab
      document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(navLink => {
        navLink.classList.add('active');
      });
    });
  });
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Global event delegation for dynamically loaded content
  document.addEventListener('click', function(e) {
    // Profile edit button
    if (e.target.matches('#editProfileBtn') || e.target.closest('#editProfileBtn')) {
      enableProfileEditing();
    }
    
    // Cancel edit button
    if (e.target.matches('#cancelEditBtn') || e.target.closest('#cancelEditBtn')) {
      disableProfileEditing();
    }
    
    // Add payment button
    if (e.target.matches('#addPaymentBtn') || e.target.closest('#addPaymentBtn')) {
      showPaymentForm();
    }
    
    // Cancel card button
    if (e.target.matches('#cancelCardBtn') || e.target.closest('#cancelCardBtn')) {
      hidePaymentForm();
    }
    
    // Cancel booking button
    if (e.target.matches('#cancelBookingBtn') || e.target.closest('#cancelBookingBtn')) {
      showConfirmDialog(
        'Are you sure you want to cancel this booking?',
        cancelBooking
      );
    }
  });
  
  // Handle form submissions
  document.addEventListener('submit', function(e) {
    // Profile form
    if (e.target.matches('#profileForm')) {
      e.preventDefault();
      updateProfile();
    }
    
    // Password form
    if (e.target.matches('#passwordForm')) {
      e.preventDefault();
      updatePassword();
    }
    
    // Add payment form
    if (e.target.matches('#addPaymentForm')) {
      e.preventDefault();
      addPaymentMethod();
    }
  });
  
  // Handle booking filter change
  document.addEventListener('change', function(e) {
    if (e.target.matches('#bookingFilter')) {
      filterBookings(e.target.value);
    }
  });
}

/**
 * Load page content
 * @param {string} page - Page name to load
 */
async function loadPage(page) {
  // Update current page
  AppState.currentPage = page;
  
  // Update URL
  window.history.pushState({ page }, '', `#${page}`);
  
  const contentContainer = document.getElementById('mainContent');
  
  // Show loading spinner
  contentContainer.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading content...</p>
    </div>
  `;
  
  try {
    // Check if page is cached
    if (!pageCache[page]) {
      // Fetch page content
      const response = await fetch(`${CONFIG.PAGES_PATH}${PAGE_URLS[page]}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status}`);
      }
      
      // Cache page content
      pageCache[page] = await response.text();
    }
    
    // Insert page content
    contentContainer.innerHTML = pageCache[page];
    contentContainer.classList.add('page-transition');
    
    // Initialize page-specific content
    initPageContent(page);
    
  } catch (error) {
    console.error('Error loading page:', error);
    contentContainer.innerHTML = `
      <div class="alert alert-danger">
        <h4 class="alert-heading">Error Loading Page</h4>
        <p>Sorry, we couldn't load the requested page. Please try again later.</p>
        <hr>
        <p class="mb-0">Error: ${error.message}</p>
      </div>
    `;
  }
}

/**
 * Initialize page-specific content
 * @param {string} page - Page name
 */
function initPageContent(page) {
  switch (page) {
    case 'bookings':
      loadBookings();
      break;
    case 'profile':
      updateProfileForm();
      break;
    case 'payment':
      loadPaymentMethods();
      break;
  }
}

/**
 * Load user data from the API
 */
async function loadUserData() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/users/${AppState.userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load user data (HTTP ${response.status})`);
    }
    
    AppState.user = await response.json();
    
    // Update user information in the header
    updateUserHeader();
    
  } catch (error) {
    console.error('Error loading user data:', error);
    showToast('Error', `Failed to load user data: ${error.message}`, 'error');
  }
}

/**
 * Update user header information
 */
function updateUserHeader() {
  if (!AppState.user) return;
  
  const user = AppState.user;
  
  // Update name displays
  document.getElementById('customerName').textContent = user.fullName || 'User';
  document.getElementById('navUsername').textContent = user.username || 'User';
  
  // Update user initials
  const initials = getInitials(user.fullName || user.username || 'User');
  document.getElementById('userInitials').textContent = initials;
}

/**
 * Update profile form with user data
 */
function updateProfileForm() {
  if (!AppState.user) return;
  
  const user = AppState.user;
  const profileForm = document.getElementById('profileForm');
  
  if (!profileForm) return;
  
  // Set form field values
  document.getElementById('fullName').value = user.fullName || '';
  document.getElementById('username').value = user.username || '';
  document.getElementById('email').value = user.uEmail || '';
  document.getElementById('phone').value = user.phone || '';
  document.getElementById('nic').value = user.nic_number || '';
  document.getElementById('address').value = user.address || '';
}

/**
 * Get initials from name
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
 * Load bookings from API
 */
async function loadBookings() {
  const bookingsList = document.getElementById('bookingsList');
  
  if (!bookingsList) return;
  
  // Show loading indicator
  bookingsList.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading your bookings...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/bookings?userId=${AppState.userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load bookings (HTTP ${response.status})`);
    }
    
    const data = await response.json();
    AppState.bookings = Array.isArray(data) ? data : [];
    
    // Render bookings
    renderBookings();
    
  } catch (error) {
    console.error('Error loading bookings:', error);
    
    bookingsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle text-danger"></i>
        <h4>Failed to Load Bookings</h4>
        <p class="text-muted">We encountered an error while loading your bookings. Please try again later.</p>
        <button class="btn btn-primary mt-3" onclick="loadBookings()">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render bookings based on filter
 * @param {string} filter - Filter (all, upcoming, completed, cancelled)
 */
function renderBookings(filter = 'all') {
  const bookingsList = document.getElementById('bookingsList');
  
  if (!bookingsList) return;
  
  // Apply filter
  let filteredBookings = filterBookingsByStatus(filter);
  
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
    const bookingItem = createBookingItem(booking);
    bookingsList.appendChild(bookingItem);
  });
}

/**
 * Filter bookings by status
 * @param {string} filter - Filter to apply
 * @returns {Array} - Filtered bookings
 */
function filterBookingsByStatus(filter) {
  if (filter === 'all') {
    return AppState.bookings;
  }
  
  const statusMap = {
    'upcoming': ['Pending', 'Confirmed', 'In Progress'],
    'completed': ['Completed'],
    'cancelled': ['Cancelled']
  };
  
  return AppState.bookings.filter(booking => 
    statusMap[filter] && statusMap[filter].includes(booking.status)
  );
}

/**
 * Create a booking item element
 * @param {Object} booking - Booking data
 * @returns {HTMLElement} - Booking item element
 */
function createBookingItem(booking) {
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
  
  return bookingItem;
}

/**
 * View booking details
 * @param {number} bookingId - Booking ID
 */
function viewBookingDetails(bookingId) {
  AppState.selectedBookingId = bookingId;
  
  // Find the booking
  const booking = AppState.bookings.find(b => b.booking_id === bookingId);
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
  
  // Populate modal content
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
              <div>${booking.package_name || 'Standard'} (${booking.category_name || 'Standard'})</div>
            </div>
            <div class="col-6">
              <div class="fw-medium">Passengers</div>
              <div>${booking.num_passengers || 1}</div>
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
  if (cancelBtn) {
    cancelBtn.style.display = canCancel ? 'block' : 'none';
  }
  
  // Show modal
  bookingModal.show();
}

/**
 * Get Bootstrap contextual class for status
 * @param {string} status - Booking status
 * @returns {string} - Bootstrap color class
 */
function getStatusColor(status) {
  const statusColors = {
    'Pending': 'warning',
    'Confirmed': 'info',
    'In Progress': 'primary',
    'Completed': 'success',
    'Cancelled': 'danger'
  };
  
  return statusColors[status] || 'secondary';
}

/**
 * Prompt to cancel a booking
 * @param {number} bookingId - Booking ID
 */
function promptCancelBooking(bookingId) {
  AppState.selectedBookingId = bookingId;
  
  showConfirmDialog(
    'Are you sure you want to cancel this booking?',
    cancelBooking
  );
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} confirmCallback - Function to call on confirmation
 */
function showConfirmDialog(message, confirmCallback) {
  document.getElementById('confirmMessage').textContent = message;
  
  document.getElementById('confirmActionBtn').onclick = function() {
    confirmCallback();
    confirmModal.hide();
  };
  
  confirmModal.show();
}

/**
 * Cancel a booking
 */
async function cancelBooking() {
  if (!AppState.selectedBookingId) return;
  
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/bookings/${AppState.selectedBookingId}/cancel`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel booking (HTTP ${response.status})`);
    }
    
    // Close modals
    bookingModal.hide();
    
    // Show success message
    showToast('Booking Cancelled', 'Your booking has been successfully cancelled.', 'success');
    
    // Reload bookings
    loadBookings();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    showToast('Error', `Failed to cancel booking: ${error.message}`, 'error');
  }
}

/**
 * Load payment methods
 */
async function loadPaymentMethods() {
  const paymentMethodsList = document.getElementById('paymentMethodsList');
  
  if (!paymentMethodsList) return;
  
  // Show loading indicator
  paymentMethodsList.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading payment methods...</p>
    </div>
  `;
  
  try {
    // In a real implementation, this would fetch from an API
    // For demo purposes, using mock data
    AppState.paymentMethods = [
      {
        id: 1,
        type: 'visa',
        cardNumber: '**** **** **** 1234',
        expiryDate: '12/25',
        cardholderName: 'John Doe'
      }
    ];
    
    // Render payment methods
    renderPaymentMethods();
    
  } catch (error) {
    console.error('Error loading payment methods:', error);
    
    paymentMethodsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle text-danger"></i>
        <h4>Failed to Load Payment Methods</h4>
        <p class="text-muted">We encountered an error while loading your payment methods. Please try again later.</p>
        <button class="btn btn-primary mt-3" onclick="loadPaymentMethods()">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render payment methods
 */
function renderPaymentMethods() {
  const paymentMethodsList = document.getElementById('paymentMethodsList');
  
  if (!paymentMethodsList) return;
  
  // Check if there are payment methods to display
  if (!AppState.paymentMethods || AppState.paymentMethods.length === 0) {
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
  AppState.paymentMethods.forEach(method => {
    const methodCard = createPaymentMethodItem(method);
    paymentMethodsList.appendChild(methodCard);
  });
}

/**
 * Create payment method item
 * @param {Object} method - Payment method data
 * @returns {HTMLElement} - Payment method element
 */
function createPaymentMethodItem(method) {
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
  
  return methodCard;
}

/**
 * Show payment form
 */
function showPaymentForm() {
  const paymentForm = document.getElementById('paymentForm');
  const addPaymentBtn = document.getElementById('addPaymentBtn');
  
  if (paymentForm) {
    paymentForm.style.display = 'block';
  }
  
  if (addPaymentBtn) {
    addPaymentBtn.style.display = 'none';
  }
}

/**
 * Hide payment form
 */
function hidePaymentForm() {
  const paymentForm = document.getElementById('paymentForm');
  const addPaymentBtn = document.getElementById('addPaymentBtn');
  const addPaymentFormEl = document.getElementById('addPaymentForm');
  
  if (paymentForm) {
    paymentForm.style.display = 'none';
  }
  
  if (addPaymentBtn) {
    addPaymentBtn.style.display = 'block';
  }
  
  if (addPaymentFormEl) {
    addPaymentFormEl.reset();
  }
}

/**
 * Add payment method
 */
function addPaymentMethod() {
  const cardType = document.getElementById('cardType').value;
  const cardName = document.getElementById('cardName').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const expiryDate = document.getElementById('expiryDate').value;
  
  // Create a new payment method (mock)
  const newMethod = {
    id: AppState.paymentMethods.length + 1,
    type: cardType,
    cardNumber: '**** **** **** ' + cardNumber.slice(-4),
    expiryDate: expiryDate,
    cardholderName: cardName
  };
  
  // Add to local array
  AppState.paymentMethods.push(newMethod);
  
  // Update UI
  renderPaymentMethods();
  
  // Hide form
  hidePaymentForm();
  
  // Show success message
  showToast('Payment Method Added', 'Your payment method has been successfully added.', 'success');
}

/**
 * Remove payment method
 * @param {number} methodId - Payment method ID
 */
function removePaymentMethod(methodId) {
  showConfirmDialog(
    'Are you sure you want to remove this payment method?',
    function() {
      // Filter out the removed method
      AppState.paymentMethods = AppState.paymentMethods.filter(method => method.id !== methodId);
      
      // Update UI
      renderPaymentMethods();
      
      // Show success message
      showToast('Payment Method Removed', 'Your payment method has been successfully removed.', 'success');
    }
  );
}

/**
 * Enable profile editing
 */
function enableProfileEditing() {
  const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
  const profileFormActions = document.getElementById('profileFormActions');
  const editProfileBtn = document.getElementById('editProfileBtn');
  
  formInputs.forEach(input => {
    if (input.id !== 'username' && input.id !== 'email' && input.id !== 'nic') {
      input.disabled = false;
    }
  });
  
  if (profileFormActions) {
    profileFormActions.style.display = 'block';
  }
  
  if (editProfileBtn) {
    editProfileBtn.style.display = 'none';
  }
}

/**
 * Disable profile editing
 */
function disableProfileEditing() {
  const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
  const profileFormActions = document.getElementById('profileFormActions');
  const editProfileBtn = document.getElementById('editProfileBtn');
  
  formInputs.forEach(input => {
    input.disabled = true;
  });
  
  if (profileFormActions) {
    profileFormActions.style.display = 'none';
  }
  
  if (editProfileBtn) {
    editProfileBtn.style.display = 'block';
  }
  
  // Reset form values
  updateProfileForm();
}

/**
 * Update user profile
 */
async function updateProfile() {
  try {
    const updatedProfile = {
      id: AppState.userId,
      fullName: document.getElementById('fullName').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value
    };
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/users/${AppState.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProfile)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update profile (HTTP ${response.status})`);
    }
    
    // Update local user details
    AppState.user = { ...AppState.user, ...updatedProfile };
    
    // Disable editing
    disableProfileEditing();
    
    // Show success message
    showToast('Profile Updated', 'Your profile has been successfully updated.', 'success');
    
    // Update UI
    updateUserHeader();
    
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Error', `Failed to update profile: ${error.message}`, 'error');
  }
}

/**
 * Update user password
 */
async function updatePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validate password match
  if (newPassword !== confirmPassword) {
    showToast('Password Error', 'New passwords do not match.', 'error');
    return;
  }
  
  try {
    // Prepare password update data
    const passwordData = {
      currentPassword,
      newPassword
    };
    
    const response = await fetch(`${CONFIG.API_BASE_URL}/users/${AppState.userId}/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update password (HTTP ${response.status})`);
    }
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Show success message
    showToast('Password Updated', 'Your password has been successfully updated.', 'success');
    
  } catch (error) {
    console.error('Error updating password:', error);
    showToast('Error', `Failed to update password: ${error.message}`, 'error');
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
  
  if (!toast || !toastTitle || !toastMessage) return;
  
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
 * Filter bookings based on selected filter
 * @param {string} filter - Filter value
 */
function filterBookings(filter) {
  renderBookings(filter);
}

/**
 * Log out the user
 */
function logout() {
  // Clear session storage
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userRole');
  
  // Redirect to login page
  window.location.href = '../login.jsp';
}

// Initialize the app when content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap components
  initBootstrapComponents();
  
  // Check authentication
  checkAuthentication();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load default page
  loadPage(CONFIG.DEFAULT_PAGE);
});