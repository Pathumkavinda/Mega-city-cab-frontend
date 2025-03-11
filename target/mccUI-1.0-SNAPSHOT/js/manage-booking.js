/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
/**
 * manage-booking.js - JavaScript for Mega City Cab Manage Bookings page
 * Created on: Mar 11, 2025
 */

// Global variables
let bookings = [];
let packages = [];
let drivers = [];
let cars = [];
let currentPage = 1;
const bookingsPerPage = 10;
let selectedBookingId = null;

// API endpoints
const API_BASE_URL = "http://localhost:8080/mccAPI/api";
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;
const PACKAGES_ENDPOINT = `${API_BASE_URL}/packages`;
const DRIVERS_ENDPOINT = `${API_BASE_URL}/drivers`;
const CARS_ENDPOINT = `${API_BASE_URL}/cars`;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initManageBookings();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the Manage Bookings page
 */
function initManageBookings() {
    // Load admin info
    loadAdminInfo();
    
    // Initialize date filters
    initDateFilters();
    
    // Load packages for filter dropdown
    loadPackages();
    
    // Load drivers for filter dropdown
    loadDrivers();
    
    // Load bookings with default filters
    loadBookings();
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
 * Initialize date filters with today's date
 */
function initDateFilters() {
    const today = new Date();
    
    // Format date as YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];
    
    // Set default date values
    document.getElementById('startDate').value = formattedDate;
    document.getElementById('endDate').value = formattedDate;
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Assign driver button
    document.getElementById('assignDriverBtn').addEventListener('click', showAssignDriverModal);
    
    // Confirm assign button
    document.getElementById('confirmAssignBtn').addEventListener('click', assignDriver);
    
    // Complete booking button
    document.getElementById('completeBookingBtn').addEventListener('click', showCompleteTripModal);
    
    // Calculate fare button
    document.getElementById('calculateFareBtn').addEventListener('click', calculateFare);
    
    // Confirm complete trip button
    document.getElementById('confirmCompleteBtn').addEventListener('click', completeTrip);
    
    // Cancel booking button in details modal
    document.getElementById('cancelBookingBtn').addEventListener('click', function() {
        showConfirmModal('Are you sure you want to cancel this booking?', cancelBooking);
    });
}

/**
 * Load packages from the API
 */
function loadPackages() {
    fetch(`${PACKAGES_ENDPOINT}?active=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load packages');
            }
            return response.json();
        })
        .then(data => {
            packages = Array.isArray(data) ? data : [];
            populatePackageFilter();
        })
        .catch(error => {
            console.error('Error loading packages:', error);
        });
}

/**
 * Populate package filter dropdown
 */
function populatePackageFilter() {
    const packageFilter = document.getElementById('packageFilter');
    
    // Clear existing options (except the first one)
    while (packageFilter.options.length > 1) {
        packageFilter.options.remove(1);
    }
    
    // Group packages by category
    const categorizedPackages = {};
    packages.forEach(pkg => {
        if (!categorizedPackages[pkg.category_name]) {
            categorizedPackages[pkg.category_name] = [];
        }
        categorizedPackages[pkg.category_name].push(pkg);
    });
    
    // Add package options grouped by category
    Object.keys(categorizedPackages).forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        
        categorizedPackages[category].forEach(pkg => {
            const option = document.createElement('option');
            option.value = pkg.package_id;
            option.textContent = pkg.package_name;
            optgroup.appendChild(option);
        });
        
        packageFilter.appendChild(optgroup);
    });
}

/**
 * Load drivers from the API
 */
function loadDrivers() {
    fetch(`${DRIVERS_ENDPOINT}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load drivers');
            }
            return response.json();
        })
        .then(data => {
            drivers = Array.isArray(data) ? data : [];
            populateDriverFilter();
        })
        .catch(error => {
            console.error('Error loading drivers:', error);
        });
}

/**
 * Populate driver filter dropdown
 */
function populateDriverFilter() {
    const driverFilter = document.getElementById('driverFilter');
    
    // Clear existing options (except the first two)
    while (driverFilter.options.length > 2) {
        driverFilter.options.remove(2);
    }
    
    // Add driver options
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.id;
        option.textContent = driver.fullName || `Driver #${driver.id}`;
        driverFilter.appendChild(option);
    });
}

/**
 * Load bookings from the API with filters
 */
function loadBookings() {
    // Get current filter values
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const packageFilter = document.getElementById('packageFilter').value;
    const driverFilter = document.getElementById('driverFilter').value;
    const searchTerm = document.getElementById('searchBooking').value.trim();
    
    // Show loading indicator
    const tableBody = document.getElementById('bookingsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="9" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i> Loading bookings...
            </td>
        </tr>
    `;
    
    // Build query parameters
    let queryParams = [];
    
    if (statusFilter !== 'all') {
        queryParams.push(`status=${statusFilter}`);
    }
    
    if (dateFilter === 'custom') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate) {
            queryParams.push(`startDate=${startDate}`);
        }
        
        if (endDate) {
            queryParams.push(`endDate=${endDate}`);
        }
    } else if (dateFilter !== 'all') {
        const dateRange = getDateRangeForFilter(dateFilter);
        if (dateRange.start) {
            queryParams.push(`startDate=${dateRange.start}`);
        }
        if (dateRange.end) {
            queryParams.push(`endDate=${dateRange.end}`);
        }
    }
    
    if (packageFilter !== 'all') {
        queryParams.push(`packageId=${packageFilter}`);
    }
    
    if (driverFilter !== 'all') {
        if (driverFilter === 'unassigned') {
            queryParams.push('unassigned=true');
        } else {
            queryParams.push(`driverId=${driverFilter}`);
        }
    }
    
    // Build query string
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    // Fetch bookings from API
    fetch(`${BOOKINGS_ENDPOINT}${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load bookings');
            }
            return response.json();
        })
        .then(data => {
            bookings = Array.isArray(data) ? data : [];
            
            // Filter by search term if provided
            if (searchTerm) {
                bookings = bookings.filter(booking => 
                    (booking.booking_id && booking.booking_id.toString().includes(searchTerm)) ||
                    (booking.user_name && booking.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (booking.pickup_location && booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (booking.destination && booking.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (booking.car_number_plate && booking.car_number_plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (booking.driver_name && booking.driver_name.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            
            // Update booking stats
            updateBookingStats();
            
            // Render bookings
            renderBookings();
            
            // Render pagination
            renderPagination();
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="9">
                        <i class="fas fa-exclamation-triangle"></i> Failed to load bookings. Please try again.
                    </td>
                </tr>
            `;
        });
}

/**
 * Get date range for predefined filter
 * @param {string} filter - Date filter value
 * @returns {Object} - Date range with start and end dates
 */
function getDateRangeForFilter(filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const formatDate = date => date.toISOString().split('T')[0];
    
    switch (filter) {
        case 'today':
            return {
                start: formatDate(today),
                end: formatDate(today)
            };
        case 'tomorrow':
            return {
                start: formatDate(tomorrow),
                end: formatDate(tomorrow)
            };
        case 'week':
            return {
                start: formatDate(startOfWeek),
                end: formatDate(endOfWeek)
            };
        case 'month':
            return {
                start: formatDate(startOfMonth),
                end: formatDate(endOfMonth)
            };
        default:
            return { start: null, end: null };
    }
}

/**
 * Update booking statistics
 */
function updateBookingStats() {
    // Count bookings by status
    const pendingCount = bookings.filter(booking => booking.status === 'Pending').length;
    const confirmedCount = bookings.filter(booking => booking.status === 'Confirmed').length;
    const inProgressCount = bookings.filter(booking => booking.status === 'In Progress').length;
    const completedCount = bookings.filter(booking => booking.status === 'Completed').length;
    
    // Update stats in UI
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('confirmedCount').textContent = confirmedCount;
    document.getElementById('inProgressCount').textContent = inProgressCount;
    document.getElementById('completedCount').textContent = completedCount;
}

/**
 * Render bookings in the table
 */
function renderBookings() {
    const tableBody = document.getElementById('bookingsTable').getElementsByTagName('tbody')[0];
    
    // Check if there are bookings to display
    if (!bookings || bookings.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">
                    <i class="fas fa-calendar-times"></i> No bookings found with the current filters.
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = Math.min(startIndex + bookingsPerPage, bookings.length);
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Populate table
    paginatedBookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Format date
        let formattedDate = '';
        let formattedTime = '';
        
        if (booking.pickup_datetime) {
            const pickupDate = new Date(booking.pickup_datetime);
            formattedDate = pickupDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            formattedTime = pickupDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Format status with appropriate styling
        const statusClass = booking.status ? booking.status.toLowerCase().replace(' ', '-') : 'pending';
        const statusDisplay = `<span class="status-badge ${statusClass}">${booking.status || 'Pending'}</span>`;
        
        // Determine which action buttons to show based on status
        let actionButtons = `
            <button class="action-btn view" onclick="viewBookingDetails(${booking.booking_id})" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
        `;
        
        if (booking.status === 'Pending') {
            actionButtons += `
                <button class="action-btn assign" onclick="showAssignDriverModalForBooking(${booking.booking_id})" title="Assign Driver">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="action-btn cancel" onclick="promptCancelBooking(${booking.booking_id})" title="Cancel Booking">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else if (booking.status === 'Confirmed' || booking.status === 'In Progress') {
            actionButtons += `
                <button class="action-btn complete" onclick="showCompleteTripModalForBooking(${booking.booking_id})" title="Complete Trip">
                    <i class="fas fa-check"></i>
                </button>
            `;
        }
        
        row.innerHTML = `
            <td>#${booking.booking_id}</td>
            <td>${booking.user_name || 'Unknown'}</td>
            <td>${booking.pickup_location || ''}</td>
            <td>${booking.destination || ''}</td>
            <td>${formattedDate}<br>${formattedTime}</td>
            <td>${booking.package_name || ''}</td>
            <td>${booking.driver_name || 'Not Assigned'}</td>
            <td>${statusDisplay}</td>
            <td class="table-actions">
                ${actionButtons}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const pagination = document.getElementById('bookingsPagination');
    const totalPages = Math.ceil((bookings ? bookings.length : 0) / bookingsPerPage);
    
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
            renderBookings();
            renderPagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBookings();
            renderPagination();
        }
    });
    
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderBookings();
            renderPagination();
        });
    });
}

/**
 * Toggle visibility of custom date range inputs
 */
function toggleDateRange() {
    const dateFilter = document.getElementById('dateFilter').value;
    const dateRangeInputs = document.querySelectorAll('.date-range-inputs');
    
    if (dateFilter === 'custom') {
        dateRangeInputs.forEach(input => {
            input.style.display = 'block';
        });
    } else {
        dateRangeInputs.forEach(input => {
            input.style.display = 'none';
        });
        
        // Reload bookings with the new filter
        applyFilters();
    }
}

/**
 * Apply filters and reload bookings
 */
function applyFilters() {
    // Reset to first page when applying filters
    currentPage = 1;
    
    // Load bookings with current filters
    loadBookings();
}

/**
 * View booking details
 * @param {number} bookingId - ID of the booking to view
 */
function viewBookingDetails(bookingId) {
    selectedBookingId = bookingId;
    
    // Find the booking
    const booking = bookings.find(b => b.booking_id === bookingId);
    if (!booking) return;
    
    const bookingDetailsContainer = document.getElementById('bookingDetailsContainer');
    
    // Format dates
    let formattedPickupDate = 'Not specified';
    let formattedPickupTime = '';
    
    if (booking.pickup_datetime) {
        const pickupDate = new Date(booking.pickup_datetime);
        formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        formattedPickupTime = pickupDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Format completion details
    let completionDetails = '';
    if (booking.status === 'Completed') {
        let formattedCompletionDate = 'Not recorded';
        
        if (booking.completion_datetime) {
            const completionDate = new Date(booking.completion_datetime);
            formattedCompletionDate = completionDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        completionDetails = `
            <div class="detail-row">
                <div class="detail-label">Completion Time</div>
                <div class="detail-value">${formattedCompletionDate}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Distance Traveled</div>
                <div class="detail-value">${booking.distance_traveled || 0} km</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Waiting Time</div>
                <div class="detail-value">${booking.waiting_time_minutes || 0} minutes</div>
            </div>
        `;
    }
    
    // Format payment details
    const paymentStatus = booking.payment_status || 'Pending';
    const paymentMethod = booking.payment_method || 'Not specified';
    
    // Format price
    const basePrice = parseFloat(booking.base_fare || 0).toFixed(2);
    const extraCharge = parseFloat(booking.extra_distance_charge || 0).toFixed(2);
    const waitingCharge = parseFloat(booking.waiting_charge || 0).toFixed(2);
    const totalPrice = parseFloat(booking.total_fare || booking.base_fare || 0).toFixed(2);
    
    // Determine which action buttons to show
    const assignDriverBtn = document.getElementById('assignDriverBtn');
    const completeBookingBtn = document.getElementById('completeBookingBtn');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    
    assignDriverBtn.style.display = 'none';
    completeBookingBtn.style.display = 'none';
    cancelBookingBtn.style.display = 'none';
    
    if (booking.status === 'Pending') {
        assignDriverBtn.style.display = 'flex';
        cancelBookingBtn.style.display = 'flex';
    } else if (booking.status === 'Confirmed' || booking.status === 'In Progress') {
        completeBookingBtn.style.display = 'flex';
    }
    
    // Build the HTML
    bookingDetailsContainer.innerHTML = `
        <div class="booking-detail-container">
            <div class="booking-detail-section">
                <h4>Booking Information</h4>
                <div class="detail-row">
                    <div class="detail-label">Booking ID</div>
                    <div class="detail-value">#${booking.booking_id}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-badge ${booking.status.toLowerCase().replace(' ', '-')}">
                            ${booking.status}
                        </span>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Pickup Date</div>
                    <div class="detail-value">${formattedPickupDate}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Pickup Time</div>
                    <div class="detail-value">${formattedPickupTime}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Passengers</div>
                    <div class="detail-value">${booking.num_passengers || 1}</div>
                </div>
                
                <div class="route-container">
                    <div class="location-point pickup">
                        <div class="location-address">${booking.pickup_location}</div>
                    </div>
                    <div class="location-point destination">
                        <div class="location-address">${booking.destination}</div>
                    </div>
                </div>
                
                ${booking.notes ? `
                <div class="detail-row">
                    <div class="detail-label">Notes</div>
                    <div class="detail-value">${booking.notes}</div>
                </div>
                ` : ''}
                
                ${completionDetails}
            </div>
            
            <div class="booking-detail-section">
                <h4>Customer Information</h4>
                <div class="detail-row">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${booking.user_name || 'Not available'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${booking.user_phone || 'Not available'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${booking.user_email || 'Not available'}</div>
                </div>
                
                <h4>Ride Information</h4>
                <div class="detail-row">
                    <div class="detail-label">Package</div>
                    <div class="detail-value">${booking.package_name || 'Standard'} (${booking.category_name || 'N/A'})</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Car</div>
                    <div class="detail-value">${booking.car_number_plate || 'Not assigned'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Driver</div>
                    <div class="detail-value">${booking.driver_name || 'Not assigned'}</div>
                </div>
                
                <h4>Payment Information</h4>
                <div class="detail-row">
                    <div class="detail-label">Payment Status</div>
                    <div class="detail-value">${paymentStatus}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Payment Method</div>
                    <div class="detail-value">${paymentMethod}</div>
                </div>
                
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
                    <div class="price-total">
                        <div>Total</div>
                        <div>Rs. ${totalPrice}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show the modal
    document.getElementById('bookingDetailsModal').classList.add('show');
}

/**
 * Show assign driver modal for a specific booking
 * @param {number} bookingId - Booking ID
 */
function showAssignDriverModalForBooking(bookingId) {
    selectedBookingId = bookingId;
    showAssignDriverModal();
}

/**
 * Show assign driver modal
 */
function showAssignDriverModal() {
    if (!selectedBookingId) return;
    
    document.getElementById('assignBookingId').textContent = selectedBookingId;
    
    // Load available drivers
    loadAvailableDrivers();
    
    // Show the modal
    document.getElementById('assignDriverModal').classList.add('show');
}

/**
 * Load available drivers for assignment
 */
function loadAvailableDrivers() {
    const driverSelect = document.getElementById('driverSelect');
    driverSelect.innerHTML = '<option value="">Loading drivers...</option>';
    
    fetch(`${DRIVERS_ENDPOINT}?available=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load available drivers');
            }
            return response.json();
        })
        .then(data => {
            const availableDrivers = Array.isArray(data) ? data : [];
            
            if (availableDrivers.length === 0) {
                driverSelect.innerHTML = '<option value="">No available drivers</option>';
                return;
            }
            
            driverSelect.innerHTML = '<option value="">Select a driver</option>';
            
            availableDrivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.id;
                option.textContent = driver.fullName || `Driver #${driver.id}`;
                driverSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading available drivers:', error);
            driverSelect.innerHTML = '<option value="">Failed to load drivers</option>';
        });
}

/**
 * Assign driver to booking
 */
function assignDriver() {
    if (!selectedBookingId) return;
    
    const driverId = document.getElementById('driverSelect').value;
    
    if (!driverId) {
        alert('Please select a driver');
        return;
    }
    
    fetch(`${BOOKINGS_ENDPOINT}/${selectedBookingId}/driver`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(driverId)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to assign driver');
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        closeAllModals();
        
        // Show success message
        showAlert('Driver assigned successfully', 'success');
        
        // Reload bookings to refresh the data
        loadBookings();
    })
    .catch(error => {
        console.error('Error assigning driver:', error);
        alert(`Error: ${error.message}`);
    });
}

/**
 * Show complete trip modal for a specific booking
 * @param {number} bookingId - Booking ID
 */
function showCompleteTripModalForBooking(bookingId) {
    selectedBookingId = bookingId;
    showCompleteTripModal();
}

/**
 * Show complete trip modal
 */
function showCompleteTripModal() {
    if (!selectedBookingId) return;
    
    document.getElementById('completeBookingId').textContent = selectedBookingId;
    
    // Get current booking
    const booking = bookings.find(b => b.booking_id === selectedBookingId);
    if (!booking) return;
    
    // Set default values
    const now = new Date();
    const nowFormatted = now.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
    
    document.getElementById('completionTime').value = nowFormatted;
    
    // Set actual pickup time if available, otherwise estimate it
    if (booking.actual_pickup_datetime) {
        const pickupTime = new Date(booking.actual_pickup_datetime);
        document.getElementById('actualPickupTime').value = pickupTime.toISOString().slice(0, 16);
    } else if (booking.pickup_datetime) {
        // Use scheduled time as default
        const pickupTime = new Date(booking.pickup_datetime);
        document.getElementById('actualPickupTime').value = pickupTime.toISOString().slice(0, 16);
    } else {
        // Default to 1 hour ago
        const oneHourAgo = new Date(now);
        oneHourAgo.setHours(now.getHours() - 1);
        document.getElementById('actualPickupTime').value = oneHourAgo.toISOString().slice(0, 16);
    }
    
    // Reset distance and waiting time
    document.getElementById('distanceTraveled').value = '';
    document.getElementById('waitingTime').value = '0';
    
    // Hide calculate fare result and confirm button
    document.getElementById('confirmCompleteBtn').style.display = 'none';
    
    // Reset fare calculation
    document.getElementById('fareCalculation').innerHTML = `
        <p class="note">Fare will be calculated based on the package terms and trip details.</p>
    `;
    
    // Show the modal
    document.getElementById('completeTripModal').classList.add('show');
}

/**
 * Calculate fare based on trip details
 */
function calculateFare() {
    if (!selectedBookingId) return;
    
    // Get booking
    const booking = bookings.find(b => b.booking_id === selectedBookingId);
    if (!booking) return;
    
    // Get package
    const pkg = packages.find(p => p.package_id === booking.package_id);
    if (!pkg) {
        alert('Package information not found');
        return;
    }
    
    // Get form values
    const distanceTraveled = parseFloat(document.getElementById('distanceTraveled').value);
    const waitingTime = parseInt(document.getElementById('waitingTime').value);
    
    // Validate form
    if (isNaN(distanceTraveled) || distanceTraveled <= 0) {
        alert('Please enter a valid distance traveled');
        return;
    }
    
    // Calculate fares
    let baseFare = pkg.base_price;
    let extraDistanceCharge = 0;
    let waitingCharge = 0;
    
    // Calculate extra distance charge for Day packages
    if (pkg.package_type === 'Day' && distanceTraveled > pkg.included_kilometers) {
        extraDistanceCharge = (distanceTraveled - pkg.included_kilometers) * pkg.per_kilometer_charge;
    } 
    // Calculate distance charge for Kilometer packages
    else if (pkg.package_type === 'Kilometer') {
        baseFare = distanceTraveled * pkg.per_kilometer_charge;
    }
    
    // Calculate waiting charge
    if (waitingTime > 0) {
        // Convert minutes to hours and apply rate
        waitingCharge = (waitingTime / 60.0) * pkg.waiting_charge;
    }
    
    // Calculate total fare
    const totalFare = baseFare + extraDistanceCharge + waitingCharge;
    
    // Update fare calculation display
    const fareCalculation = document.getElementById('fareCalculation');
    fareCalculation.innerHTML = `
        <h4>Fare Calculation</h4>
        <div class="calc-row">
            <div class="calc-description">Base Fare (${pkg.package_type} Package)</div>
            <div class="calc-amount">Rs. ${baseFare.toFixed(2)}</div>
        </div>
        
        ${pkg.package_type === 'Day' ? `
        <div class="calc-row">
            <div class="calc-description">Included Kilometers</div>
            <div class="calc-amount">${pkg.included_kilometers} km</div>
        </div>
        ` : ''}
        
        <div class="calc-row">
            <div class="calc-description">Distance Traveled</div>
            <div class="calc-amount">${distanceTraveled} km</div>
        </div>
        
        ${extraDistanceCharge > 0 ? `
        <div class="calc-row">
            <div class="calc-description">Extra Distance Charge (${(distanceTraveled - pkg.included_kilometers).toFixed(1)} km × Rs. ${pkg.per_kilometer_charge.toFixed(2)})</div>
            <div class="calc-amount">Rs. ${extraDistanceCharge.toFixed(2)}</div>
        </div>
        ` : ''}
        
        ${waitingTime > 0 ? `
        <div class="calc-row">
            <div class="calc-description">Waiting Charge (${waitingTime} min)</div>
            <div class="calc-amount">Rs. ${waitingCharge.toFixed(2)}</div>
        </div>
        ` : ''}
        
        <div class="calc-total">
            <div>Total Fare</div>
            <div>Rs. ${totalFare.toFixed(2)}</div>
        </div>
    `;
    
    // Show confirm button
    document.getElementById('confirmCompleteBtn').style.display = 'block';
    
    // Store calculated values for submission
    document.getElementById('confirmCompleteBtn').dataset.baseFare = baseFare.toFixed(2);
    document.getElementById('confirmCompleteBtn').dataset.extraDistanceCharge = extraDistanceCharge.toFixed(2);
    document.getElementById('confirmCompleteBtn').dataset.waitingCharge = waitingCharge.toFixed(2);
    document.getElementById('confirmCompleteBtn').dataset.totalFare = totalFare.toFixed(2);
}

/**
 * Complete a trip
 */
function completeTrip() {
    if (!selectedBookingId) return;
    
    // Get form values
    const actualPickupTime = document.getElementById('actualPickupTime').value;
    const completionTime = document.getElementById('completionTime').value;
    const distanceTraveled = parseFloat(document.getElementById('distanceTraveled').value);
    const waitingTime = parseInt(document.getElementById('waitingTime').value);
    
    // Get calculated fares from button's dataset
    const baseFare = parseFloat(document.getElementById('confirmCompleteBtn').dataset.baseFare);
    const extraDistanceCharge = parseFloat(document.getElementById('confirmCompleteBtn').dataset.extraDistanceCharge);
    const waitingCharge = parseFloat(document.getElementById('confirmCompleteBtn').dataset.waitingCharge);
    const totalFare = parseFloat(document.getElementById('confirmCompleteBtn').dataset.totalFare);
    
    // Validate form
    if (!completionTime) {
        alert('Please enter a completion time');
        return;
    }
    
    if (isNaN(distanceTraveled) || distanceTraveled <= 0) {
        alert('Please enter a valid distance traveled');
        return;
    }
    
    // Prepare data
    const completionData = {
        actualPickupDateTime: actualPickupTime,
        completionDateTime: completionTime,
        distanceTraveled: distanceTraveled,
        waitingTimeMinutes: waitingTime,
        baseFare: baseFare,
        extraDistanceCharge: extraDistanceCharge,
        waitingCharge: waitingCharge,
        totalFare: totalFare
    };
    
    // Send request to API
    fetch(`${BOOKINGS_ENDPOINT}/${selectedBookingId}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to complete trip');
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        closeAllModals();
        
        // Show success message
        showAlert('Trip completed successfully', 'success');
        
        // Reload bookings to refresh the data
        loadBookings();
    })
    .catch(error => {
        console.error('Error completing trip:', error);
        alert(`Error: ${error.message}`);
    });
}

/**
 * Prompt to cancel a booking
 * @param {number} bookingId - Booking ID to cancel
 */
function promptCancelBooking(bookingId) {
    selectedBookingId = bookingId;
    showConfirmModal('Are you sure you want to cancel this booking?', cancelBooking);
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
        closeAllModals();
        
        // Show success message
        showAlert('Booking cancelled successfully', 'success');
        
        // Reload bookings to refresh the data
        loadBookings();
    })
    .catch(error => {
        console.error('Error cancelling booking:', error);
        alert(`Error: ${error.message}`);
    });
}

/**
 * Show confirmation modal
 * @param {string} message - Confirmation message
 * @param {Function} action - Action to execute on confirmation
 */
function showConfirmModal(message, action) {
    // Set message
    document.getElementById('confirmMessage').textContent = message;
    
    // Set action
    document.getElementById('confirmActionBtn').onclick = action;
    
    // Show modal
    document.getElementById('confirmModal').classList.add('show');
}

/**
 * Close all modals
 */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
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

