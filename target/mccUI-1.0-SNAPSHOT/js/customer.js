/**
 * MegacityCabs - Customer JavaScript Module
 * Handles all customer-side functionality including dashboard, bookings, and profile management
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Customer.js loaded");
    
    // Debug session storage
    console.log("Session storage contents:", {
        userId: sessionStorage.getItem('userId'),
        userRole: sessionStorage.getItem('userRole'),
        userName: sessionStorage.getItem('userName'),
        userEmail: sessionStorage.getItem('userEmail')
    });
    
    // Fix for welcome message when id="user-name" doesn't exist
    const welcomeHeading = document.querySelector('.welcome-section h2') || 
                          document.querySelector('h2');
    
    if (welcomeHeading && welcomeHeading.textContent.includes('Welcome')) {
        const userName = sessionStorage.getItem('userName') || 
                       sessionStorage.getItem('userEmail') || 
                       'Customer';
        
        welcomeHeading.textContent = `Welcome, ${userName}!`;
        console.log("Updated welcome message with:", userName);
    }
    
    // Continue with existing code...
    validateUserSession();
    initializeMenuToggle();
});
/**
 * Initialize common elements across all customer pages
 */
// In your customer.js file, locate the part that handles the user name display
function initializeCommonElements() {
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Display user name if element exists
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        console.log("Found user-name element");
        const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('userEmail') || 'Customer';
        console.log("User name from session:", userName);
        userNameElement.textContent = userName;
    } else {
        console.log("Could not find user-name element in the document");
        // Try to find it by other potential IDs
        const alternativeElements = document.querySelectorAll('h2');
        console.log("Looking for heading elements:", alternativeElements.length);
        alternativeElements.forEach(el => {
            if (el.textContent.includes('Welcome')) {
                console.log("Found welcome element:", el.textContent);
                const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('userEmail') || 'Customer';
                el.textContent = `Welcome, ${userName}!`;
            }
        });
    }
}

/**
 * Initialize responsive menu toggle
 */
function initializeMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Create error and success message containers if they don't exist
 */
function setupMessageContainers() {
    // Only create containers if they don't already exist
    if (!document.getElementById('error-message')) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-message';
        errorContainer.className = 'message-container error';
        document.body.appendChild(errorContainer);
    }
    
    if (!document.getElementById('success-message')) {
        const successContainer = document.createElement('div');
        successContainer.id = 'success-message';
        successContainer.className = 'message-container success';
        document.body.appendChild(successContainer);
    }
}

/**
 * Initialize page-specific functionality based on current page
 */
function initializePage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('customerDash.jsp')) {
        initializeDashboard();
    } else if (currentPath.includes('bookingHistory.jsp')) {
        initializeBookingHistory();
    } else if (currentPath.includes('addBooking.jsp')) {
        initializeBookingForm();
    }
}

/**
 * Perform a complete logout, clearing all session data
 * and providing visual confirmation to the user.
 */
function logout() {
    // Log the logout attempt
    console.log('Logout initiated - clearing all session data');
    
    // Create a list of session items to inspect before clearing
    const sessionItems = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        // Don't log full objects that might be large
        if (key === 'userData') {
            sessionItems[key] = '[Object data]';
        } else {
            sessionItems[key] = sessionStorage.getItem(key);
        }
    }
    console.log('Session items before clearing:', sessionItems);
    
    // Create and show logout notification
    showLogoutNotification();
    
    // Clear all browsing session data
    try {
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear localStorage items related to the app
        const localStorageKeysToRemove = [
            'rememberedUser',
            'megaCityCabSettings',
            'lastLoginTime',
            // Add any other localStorage keys your app might use
        ];
        
        localStorageKeysToRemove.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Clear any authentication cookies if present
        clearAuthCookies();
        
        console.log('All session data cleared successfully');
    } catch (err) {
        console.error('Error clearing session data:', err);
    }
    
    // Optional: Make a server-side logout call to invalidate the session
    try {
        fetch('http://localhost:8080/mccAPI/api/users/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Server-side session invalidated successfully');
            } else {
                console.warn('Server-side logout returned non-OK status:', response.status);
            }
        })
        .catch(error => {
            console.warn('Server-side logout request failed, continuing with client-side logout:', error);
        });
    } catch (error) {
        console.warn('Error making server logout request:', error);
    }
    
    // Wait for notification to display before redirecting
    setTimeout(() => {
        // Perform final check to ensure sessionStorage is really empty
        if (sessionStorage.length > 0) {
            console.warn('Session storage still contains items after clearing. Attempting force clear...');
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                sessionStorage.removeItem(key);
            }
        }
        
        // Redirect to login page
        window.location.href = '../login.jsp';
    }, 1500);
}

/**
 * Display logout notification to provide user feedback
 */
function showLogoutNotification() {
    // Create notification if it doesn't exist
    if (!document.getElementById('logout-notification')) {
        const notificationWrapper = document.createElement('div');
        notificationWrapper.id = 'logout-notification';
        notificationWrapper.className = 'logout-notification';
        
        notificationWrapper.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-message">
                    <h3>Logged Out Successfully</h3>
                    <p>You have been securely logged out.</p>
                    <div class="redirect-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notificationWrapper);
        
        // Add progress bar animation
        setTimeout(() => {
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 100);
    }
    
    // Show the notification with animation
    const notification = document.getElementById('logout-notification');
    if (notification) {
        notification.classList.add('show');
    }
}

/**
 * Clear authentication-related cookies
 */
function clearAuthCookies() {
    // List of potential authentication cookies to clear
    const authCookies = [
        'JSESSIONID',
        'auth_token',
        'user_session',
        'remember_user',
        // Add any other cookies your app might use
    ];
    
    authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
}

/**
 * Initialize all logout buttons on the page
 */
function initializeLogoutButtons() {
    // Find all logout buttons in the document
    const logoutButtons = document.querySelectorAll('a[id="logout-btn"], a[href="#logout"], a.logout-link');
    
    // Attach event handlers
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
    
    console.log(`Initialized ${logoutButtons.length} logout button(s)`);
}

// Initialize logout buttons when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLogoutButtons();
});

/* ===========================================
   DASHBOARD FUNCTIONALITY
   =========================================== */

/**
 * Initialize the customer dashboard
 */
function initializeDashboard() {
    console.log('Initializing customer dashboard...');
    
    // Fetch stats for the dashboard
    fetchBookingStats();
    
    // Load recent bookings
    loadRecentBookings();
    
    // Set up profile button event
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileModal();
        });
    }
}

/**
 * Fetch booking statistics for the dashboard
 */
function fetchBookingStats() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;
    
    // Show loading state for stats cards
    document.getElementById('active-bookings').textContent = '...';
    document.getElementById('past-rides').textContent = '...';
    document.getElementById('avg-rating').textContent = '...';
    
    fetch(`http://localhost:8080/mccAPI/api/bookings/stats/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load booking statistics');
            }
            return response.json();
        })
        .then(stats => {
            // Update dashboard statistics
            document.getElementById('active-bookings').textContent = stats.activeBookings || 0;
            document.getElementById('past-rides').textContent = stats.completedBookings || 0;
            document.getElementById('avg-rating').textContent = stats.averageRating ? stats.averageRating.toFixed(1) : '0.0';
        })
        .catch(error => {
            console.error('Error fetching booking statistics:', error);
            
            // Set default values in case of error
            document.getElementById('active-bookings').textContent = '0';
            document.getElementById('past-rides').textContent = '0';
            document.getElementById('avg-rating').textContent = '0.0';
            
            showError('Failed to load statistics. Please refresh the page or try again later.');
        });
}

/**
 * Load recent bookings for the dashboard
 */
function loadRecentBookings() {
    const userId = sessionStorage.getItem('userId');
    const recentBookingsList = document.getElementById('recent-bookings-list');
    
    if (!recentBookingsList || !userId) return;
    
    // Show loading message
    recentBookingsList.innerHTML = '<p class="loading-message">Loading your recent bookings...</p>';
    
    fetch(`http://localhost:8080/mccAPI/api/bookings/recent/${userId}?limit=5`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load recent bookings');
            }
            return response.json();
        })
        .then(bookings => {
            // Clear loading message
            recentBookingsList.innerHTML = '';
            
            if (bookings.length === 0) {
                recentBookingsList.innerHTML = '<p class="no-data">No recent bookings found. <a href="addBooking.jsp">Book a ride now!</a></p>';
                return;
            }
            
            // Create the bookings list
            bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking, true);
                recentBookingsList.appendChild(bookingElement);
            });
        })
        .catch(error => {
            console.error('Error loading recent bookings:', error);
            recentBookingsList.innerHTML = '<p class="error-message">Error loading recent bookings. Please try again later.</p>';
        });
}

/**
 * Display user profile modal
 */
function showProfileModal() {
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    // Create modal if it doesn't exist
    if (!document.getElementById('profile-modal')) {
        createProfileModal();
    }
    
    // Populate form with user data
    const form = document.getElementById('profile-form');
    if (form) {
        // Set values for form fields if they exist
        if (form.elements['fullName']) form.elements['fullName'].value = userData.fullName || '';
        if (form.elements['email']) form.elements['email'].value = userData.email || sessionStorage.getItem('userEmail') || '';
        if (form.elements['phone']) form.elements['phone'].value = userData.phone || '';
        if (form.elements['address']) form.elements['address'].value = userData.address || '';
    }
    
    // Show the modal
    document.getElementById('profile-modal').style.display = 'flex';
}

/**
 * Create profile modal dialog
 */
function createProfileModal() {
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="profile-form">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required readonly>
                        <small>Email cannot be changed</small>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <textarea id="address" name="address" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password (leave blank to keep current)</label>
                        <input type="password" id="new-password" name="newPassword">
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" id="save-profile-btn">Save Changes</button>
                <button class="btn-secondary close-modal-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Save button event listener
    const saveButton = document.getElementById('save-profile-btn');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            updateUserProfile();
        });
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * Update user profile information
 */
function updateUserProfile() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Validate password match if changing password
    const newPassword = form.elements['newPassword'].value;
    const confirmPassword = form.elements['confirmPassword'].value;
    
    if (newPassword && newPassword !== confirmPassword) {
        showError('New passwords do not match');
        return;
    }
    
    // Get user ID from session
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showError('User session expired. Please log in again.');
        setTimeout(() => {
            window.location.href = '../login.jsp';
        }, 2000);
        return;
    }
    
    // Create update data object
    const updateData = {
        userId: parseInt(userId),
        fullName: form.elements['fullName'].value,
        phone: form.elements['phone'].value,
        address: form.elements['address'].value
    };
    
    // Add password if changed
    if (newPassword) {
        updateData.newPassword = newPassword;
    }
    
    // Show loading state
    const saveButton = document.getElementById('save-profile-btn');
    if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;
    }
    
    // Send update request to API
    fetch(`http://localhost:8080/mccAPI/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        // Update session storage with new data
        if (data.fullName) sessionStorage.setItem('userName', data.fullName);
        
        // Update userData in session storage
        const currentUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const updatedUserData = { ...currentUserData, ...updateData };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Show success message
        showSuccess('Profile updated successfully');
        
        // Update displayed username
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && data.fullName) {
            userNameElement.textContent = data.fullName;
        }
        
        // Close modal
        document.getElementById('profile-modal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showError('Failed to update profile: ' + error.message);
    })
    .finally(() => {
        // Reset button state
        const saveButton = document.getElementById('save-profile-btn');
        if (saveButton) {
            saveButton.textContent = 'Save Changes';
            saveButton.disabled = false;
        }
    });
}

/* ===========================================
   BOOKING HISTORY FUNCTIONALITY
   =========================================== */

/**
 * Initialize booking history page
 */
function initializeBookingHistory() {
    console.log('Initializing booking history page...');
    
    // Load booking history
    loadBookingHistory();
    
    // Set up filter events
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-bookings');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-search-btn');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadBookingHistory();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            loadBookingHistory();
        });
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchBookings(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBookings(searchInput.value);
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('search-bookings');
            if (searchInput) {
                searchInput.value = '';
            }
            loadBookingHistory();
        });
    }
}

/**
 * Load booking history with filters
 * @param {number} page - Page number for pagination
 */
function loadBookingHistory(page = 1) {
    const userId = sessionStorage.getItem('userId');
    const bookingHistoryList = document.getElementById('booking-history-list');
    
    if (!bookingHistoryList || !userId) return;
    
    // Show loading message
    bookingHistoryList.innerHTML = '<p class="loading-message">Loading your booking history...</p>';
    
    // Get filter values
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const dateFilter = document.getElementById('date-filter')?.value || 'all';
    
    // Build query parameters
    let queryParams = [`userId=${userId}`, `page=${page}`];
    
    if (statusFilter !== 'all') {
        queryParams.push(`status=${statusFilter}`);
    }
    
    if (dateFilter !== 'all') {
        queryParams.push(`period=${dateFilter}`);
    }
    
    // Create query string
    const queryString = queryParams.join('&');
    
    // Fetch booking history
    fetch(`http://localhost:8080/mccAPI/api/bookings?${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load booking history');
            }
            return response.json();
        })
        .then(result => {
            // Handle pagination data
            const bookings = result.bookings || result; // Handle both array and pagination object
            const totalPages = result.totalPages || 1;
            const currentPage = result.currentPage || 1;
            
            // Clear loading message
            bookingHistoryList.innerHTML = '';
            
            if (bookings.length === 0) {
                bookingHistoryList.innerHTML = '<p class="no-data">No bookings found matching your criteria. <a href="addBooking.jsp">Book a ride now!</a></p>';
                return;
            }
            
            // Create the bookings list
            bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking, false);
                bookingHistoryList.appendChild(bookingElement);
            });
            
            // Setup pagination
            setupPagination(totalPages, currentPage);
        })
        .catch(error => {
            console.error('Error fetching booking history:', error);
            bookingHistoryList.innerHTML = '<p class="error-message">Error loading booking history. Please try again later.</p>';
            showError('Failed to load booking history: ' + error.message);
        });
}

/**
 * Search bookings by keyword
 * @param {string} query - Search query
 */
function searchBookings(query) {
    if (!query.trim()) {
        loadBookingHistory();
        return;
    }
    
    const userId = sessionStorage.getItem('userId');
    const bookingHistoryList = document.getElementById('booking-history-list');
    
    if (!bookingHistoryList || !userId) return;
    
    // Show loading message
    bookingHistoryList.innerHTML = '<p class="loading-message">Searching bookings...</p>';
    
    // Fetch filtered bookings
    fetch(`http://localhost:8080/mccAPI/api/bookings/search?userId=${userId}&query=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to search bookings');
            }
            return response.json();
        })
        .then(bookings => {
            // Clear loading message
            bookingHistoryList.innerHTML = '';
            
            if (bookings.length === 0) {
                bookingHistoryList.innerHTML = `
                    <p class="no-data">
                        No bookings found matching your search.
                        <button class="clear-search" onclick="loadBookingHistory()">Clear search</button>
                    </p>`;
                return;
            }
            
            // Create the bookings list
            bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking, false);
                bookingHistoryList.appendChild(bookingElement);
            });
            
            // Hide pagination for search results
            const paginationElement = document.getElementById('pagination');
            if (paginationElement) {
                paginationElement.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error searching bookings:', error);
            bookingHistoryList.innerHTML = '<p class="error-message">Error searching bookings. Please try again later.</p>';
            showError('Search failed: ' + error.message);
        });
}

/**
 * Set up pagination for booking history
 * @param {number} totalPages - Total number of pages
 * @param {number} currentPage - Current active page
 */
function setupPagination(totalPages, currentPage) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;
    
    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}" 
                ${currentPage === 1 ? 'disabled' : `onclick="loadBookingHistory(${currentPage - 1})"`}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn page-number" onclick="loadBookingHistory(1)">1</button>
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn page-number ${i === currentPage ? 'active' : ''}" 
                    onclick="loadBookingHistory(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn page-number" onclick="loadBookingHistory(${totalPages})">
                ${totalPages}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}" 
                ${currentPage === totalPages ? 'disabled' : `onclick="loadBookingHistory(${currentPage + 1})"`}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationElement.innerHTML = paginationHTML;
}

/**
 * Create a booking element for display
 * @param {Object} booking - Booking data
 * @param {boolean} isCompact - Whether to use compact display (for dashboard)
 * @returns {HTMLElement} - Booking element
 */
function createBookingElement(booking, isCompact) {
    const bookingElement = document.createElement('div');
    bookingElement.className = `booking-item ${booking.status.toLowerCase().replace(/\s+/g, '-')}`;
    bookingElement.dataset.bookingId = booking.booking_id;
    
    const bookingDate = new Date(booking.pickup_datetime);
    const formattedDate = bookingDate.toLocaleDateString();
    const formattedTime = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let statusClass = '';
    switch (booking.status.toLowerCase()) {
        case 'completed':
            statusClass = 'status-completed';
            break;
        case 'cancelled':
            statusClass = 'status-cancelled';
            break;
        case 'pending':
            statusClass = 'status-pending';
            break;
        case 'confirmed':
        case 'in progress':
            statusClass = 'status-active';
            break;
        default:
            statusClass = '';
    }
    
    if (isCompact) {
        // Compact view for dashboard
        bookingElement.innerHTML = `
            <div class="booking-header">
                <span class="booking-id">#${booking.booking_id}</span>
                <span class="booking-status ${statusClass}">${booking.status}</span>
            </div>
            <div class="booking-content">
                <div class="booking-route">
                    <p class="pickup"><i class="fas fa-map-marker-alt"></i> ${booking.pickup_location}</p>
                    <p class="destination"><i class="fas fa-flag-checkered"></i> ${booking.destination}</p>
                </div>
                <div class="booking-time">
                    <p><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                    <p><i class="far fa-clock"></i> ${formattedTime}</p>
                </div>
            </div>
            <div class="booking-footer">
                <a href="javascript:void(0)" class="view-details-btn" data-booking-id="${booking.booking_id}">
                    <i class="fas fa-info-circle"></i> View Details
                </a>
            </div>
        `;
    } else {
        // Full view for history page
        bookingElement.innerHTML = `
            <div class="booking-header">
                <span class="booking-id">#${booking.booking_id}</span>
                <span class="booking-date">${formattedDate} at ${formattedTime}</span>
                <span class="booking-status ${statusClass}">${booking.status}</span>
            </div>
            <div class="booking-content">
                <div class="booking-route">
                    <p class="pickup"><i class="fas fa-map-marker-alt"></i> <strong>From:</strong> ${booking.pickup_location}</p>
                    <p class="destination"><i class="fas fa-flag-checkered"></i> <strong>To:</strong> ${booking.destination}</p>
                </div>
                <div class="booking-details">
                    <p><i class="fas fa-car"></i> <strong>Package:</strong> ${booking.package_name || 'Standard'}</p>
                    <p><i class="fas fa-users"></i> <strong>Passengers:</strong> ${booking.num_passengers || 1}</p>
                    ${booking.driver_name ? `<p><i class="fas fa-id-card"></i> <strong>Driver:</strong> ${booking.driver_name}</p>` : ''}
                    <p><i class="fas fa-money-bill-wave"></i> <strong>Fare:</strong> LKR ${booking.total_fare ? booking.total_fare.toFixed(2) : (booking.base_fare ? booking.base_fare.toFixed(2) : '0.00')}</p>
                </div>
            </div>
            <div class="booking-footer">
                ${booking.status.toLowerCase() === 'pending' ? `
                    <button class="cancel-btn" data-booking-id="${booking.booking_id}">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                ` : ''}
                <button class="view-details-btn" data-booking-id="${booking.booking_id}">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
            </div>
        `;
    }
    
    // Add event listeners to buttons (using setTimeout to ensure DOM is ready)
    setTimeout(() => {
        const viewDetailsBtn = bookingElement.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-booking-id');
                showBookingDetails(bookingId);
            });
        }
        
        const cancelBtn = bookingElement.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-booking-id');
                confirmCancelBooking(bookingId);
            });
        }
    }, 0);
    
    return bookingElement;
}

/**
 * Show booking details in a modal
 * @param {string} bookingId - ID of the booking to show
 */
function showBookingDetails(bookingId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('booking-details-modal')) {
        createBookingDetailsModal();
    }
    
    // Show loading state in modal
    const modalBody = document.getElementById('booking-details-content');
    if (modalBody) {
        modalBody.innerHTML = '<p class="loading-message">Loading booking details...</p>';
    }
    
    // Show the modal
    document.getElementById('booking-details-modal').style.display = 'flex';
    
    // Fetch booking details
    fetch(`http://localhost:8080/mccAPI/api/bookings/${bookingId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load booking details');
            }
            return response.json();
        })
        .then(booking => {
            populateBookingDetails(booking);
        })
        .catch(error => {
            console.error('Error loading booking details:', error);
            
            if (modalBody) {
                modalBody.innerHTML = '<p class="error-message">Error loading booking details. Please try again later.</p>';
            }
            
            showError('Failed to load booking details: ' + error.message);
        });
}

/**
 * Populate booking details in the modal
 * @param {Object} booking - Booking data
 */
function populateBookingDetails(booking) {
    // Format dates
    const pickupDate = new Date(booking.pickup_datetime);
    const formattedPickupDate = pickupDate.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const formattedPickupTime = pickupDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Completion details
    let completionDetails = '';
    if (booking.status === 'Completed' && booking.completion_datetime) {
        const completionDate = new Date(booking.completion_datetime);
        const formattedCompletionDate = completionDate.toLocaleDateString();
        const formattedCompletionTime = completionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        completionDetails = `
            <div class="detail-row">
                <div class="detail-label">Completion Time</div>
                <div class="detail-value">${formattedCompletionDate} ${formattedCompletionTime}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Distance</div>
                <div class="detail-value">${booking.distance_traveled || 0} km</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Waiting Time</div>
                <div class="detail-value">${booking.waiting_time_minutes || 0} minutes</div>
            </div>
        `;
    }
    
    // Set modal content
    const modalBody = document.getElementById('booking-details-content');
    modalBody.innerHTML = `
        <div class="details-section">
            <h3>Booking Information</h3>
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
                <div class="detail-label">Pickup Location</div>
                <div class="detail-value">${booking.pickup_location}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Destination</div>
                <div class="detail-value">${booking.destination}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Package</div>
                <div class="detail-value">${booking.package_name || 'Standard'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Passengers</div>
                <div class="detail-value">${booking.num_passengers || 1}</div>
            </div>
            ${booking.driver_name ? `
            <div class="detail-row">
                <div class="detail-label">Driver</div>
                <div class="detail-value">${booking.driver_name}</div>
            </div>
            ` : ''}
            ${booking.notes ? `
            <div class="detail-row">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${booking.notes}</div>
            </div>
            ` : ''}
            ${completionDetails}
        </div>
        
        <div class="details-section">
            <h3>Fare Details</h3>
            <div class="detail-row">
                <div class="detail-label">Base Fare</div>
                <div class="detail-value">LKR ${booking.base_fare ? booking.base_fare.toFixed(2) : '0.00'}</div>
            </div>
            ${booking.extra_distance_charge > 0 ? `
            <div class="detail-row">
                <div class="detail-label">Extra Distance</div>
                <div class="detail-value">LKR ${booking.extra_distance_charge.toFixed(2)}</div>
            </div>
            ` : ''}
            ${booking.waiting_charge > 0 ? `
            <div class="detail-row">
                <div class="detail-label">Waiting Charge</div>
                <div class="detail-value">LKR ${booking.waiting_charge.toFixed(2)}</div>
            </div>
            ` : ''}
            <div class="detail-row total-fare">
                <div class="detail-label">Total Fare</div>
                <div class="detail-value">LKR ${booking.total_fare ? booking.total_fare.toFixed(2) : (booking.base_fare ? booking.base_fare.toFixed(2) : '0.00')}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Payment Status</div>
                <div class="detail-value">${booking.payment_status || 'Pending'}</div>
            </div>
        </div>
    `;
    
    // Show cancel button for pending bookings
    const cancelButton = document.getElementById('booking-cancel-btn');
    if (cancelButton) {
        if (booking.status.toLowerCase() === 'pending') {
            cancelButton.style.display = 'block';
            cancelButton.setAttribute('data-booking-id', booking.booking_id);
        } else {
            cancelButton.style.display = 'none';
        }
    }
}

/**
 * Create booking details modal if it doesn't exist
 */
function createBookingDetailsModal() {
    const modal = document.createElement('div');
    modal.id = 'booking-details-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Booking Details</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div id="booking-details-content"></div>
            </div>
            <div class="modal-footer">
                <button id="booking-cancel-btn" class="btn-danger" style="display:none;">Cancel Booking</button>
                <button class="btn-secondary close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Add cancel button event listener
    const cancelButton = document.getElementById('booking-cancel-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            confirmCancelBooking(bookingId);
            modal.style.display = 'none'; // Close modal after clicking cancel
        });
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * Confirm booking cancellation
 * @param {string} bookingId - ID of the booking to cancel
 */
function confirmCancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        cancelBooking(bookingId);
    }
}

/**
 * Cancel a booking
 * @param {string} bookingId - ID of the booking to cancel
 */
function cancelBooking(bookingId) {
    fetch(`http://localhost:8080/mccAPI/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        showSuccess('Booking cancelled successfully');
        
        // Reload bookings
        if (window.location.pathname.includes('bookingHistory.jsp')) {
            loadBookingHistory();
        } else if (window.location.pathname.includes('customerDash.jsp')) {
            fetchBookingStats();
            loadRecentBookings();
        }
    })
    .catch(error => {
        console.error('Error cancelling booking:', error);
        showError('Failed to cancel booking: ' + error.message);
    });
}

/* ===========================================
   NEW BOOKING FUNCTIONALITY
   =========================================== */

/**
 * Initialize the booking form
 */
function initializeBookingForm() {
    console.log('Initializing booking form...');
    
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    // Set default dates and times
    initializeDateTime();
    
    // Load available vehicle types/packages
    loadVehicleTypes();
    
    // Set up form submission handler
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBookingForm();
    });
    
    // Setup fare estimate calculation
    setupFareEstimation();
}

/**
 * Initialize date and time pickers with defaults
 */
function initializeDateTime() {
    const pickupDateInput = document.getElementById('pickup-date');
    const pickupTimeInput = document.getElementById('pickup-time');
    
    if (pickupDateInput) {
        // Set minimum date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        pickupDateInput.min = formattedDate;
        pickupDateInput.value = formattedDate;
    }
    
    if (pickupTimeInput) {
        // Set default time to current time + 1 hour, rounded to nearest 15 minutes
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        pickupTimeInput.value = `${hours}:${minutes}`;
    }
}

/**
 * Load vehicle types/packages from API
 */
function loadVehicleTypes() {
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    if (!vehicleTypeSelect) return;
    
    // Show loading state
    vehicleTypeSelect.innerHTML = '<option value="">Loading packages...</option>';
    vehicleTypeSelect.disabled = true;
    
    // Fetch packages from the API
    fetch('http://localhost:8080/mccAPI/api/packages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load packages');
            }
            return response.json();
        })
        .then(packages => {
            // Clear loading option
            vehicleTypeSelect.innerHTML = '<option value="">Select a package</option>';
            
            // Add packages as options
            packages.forEach(pkg => {
                const option = document.createElement('option');
                option.value = pkg.package_id;
                
                // Create descriptive option text
                let optionText = `${pkg.package_name} (${pkg.package_type})`;
                
                // Add pricing info based on package type
                if (pkg.package_type === 'Day') {
                    optionText += ` - LKR ${pkg.base_price} (${pkg.included_kilometers} km)`;
                } else if (pkg.package_type === 'Kilometer') {
                    optionText += ` - LKR ${pkg.per_kilometer_charge}/km`;
                }
                
                option.textContent = optionText;
                
                // Store additional data as attributes
                option.dataset.basePrice = pkg.base_price;
                option.dataset.packageType = pkg.package_type;
                option.dataset.perKm = pkg.per_kilometer_charge;
                option.dataset.includedKm = pkg.included_kilometers;
                option.dataset.categoryId = pkg.category_id;
                
                vehicleTypeSelect.appendChild(option);
            });
            
            // Enable the select
            vehicleTypeSelect.disabled = false;
        })
        .catch(error => {
            console.error('Error loading packages:', error);
            vehicleTypeSelect.innerHTML = '<option value="">Error loading packages</option>';
            vehicleTypeSelect.disabled = true;
            showError('Failed to load packages. Please try again later.');
        });
}

/**
 * Set up fare estimation functionality
 */
function setupFareEstimation() {
    const pickupLocation = document.getElementById('pickup-location');
    const destination = document.getElementById('destination');
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    
    if (pickupLocation && destination && vehicleTypeSelect) {
        [pickupLocation, destination, vehicleTypeSelect].forEach(element => {
            element.addEventListener('change', calculateFareEstimate);
        });
    }
}

/**
 * Calculate and display fare estimate
 */
function calculateFareEstimate() {
    const pickupLocation = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    const fareEstimateDiv = document.getElementById('fare-estimate');
    
    if (!pickupLocation || !destination || !vehicleTypeSelect.value || !fareEstimateDiv) {
        return;
    }
    
    // Get selected package information
    const selectedOption = vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex];
    const packageType = selectedOption.dataset.packageType;
    const basePrice = parseFloat(selectedOption.dataset.basePrice);
    const perKmRate = parseFloat(selectedOption.dataset.perKm);
    const includedKm = parseFloat(selectedOption.dataset.includedKm);
    
    // For this demo, we'll use a dummy distance calculation
    // In a real implementation, you might use a distance API
    // Simulate a distance between 5-30 km
    const estimatedDistance = Math.floor(Math.random() * 25) + 5;
    
    // Calculate estimated fare based on package type
    let estimatedFare = 0;
    let fareDetails = '';
    
    if (packageType === 'Day') {
        estimatedFare = basePrice;
        const extraKm = Math.max(0, estimatedDistance - includedKm);
        if (extraKm > 0) {
            estimatedFare += extraKm * perKmRate;
        }
        
        fareDetails = `
            <p class="fare-detail">Base price: LKR ${basePrice.toFixed(2)}</p>
            <p class="fare-detail">Estimated distance: ${estimatedDistance} km</p>
            <p class="fare-detail">Included kilometers: ${includedKm} km</p>
            ${extraKm > 0 ? `<p class="fare-detail">Extra kilometers: ${extraKm} km at LKR ${perKmRate}/km</p>` : ''}
            <p class="fare-detail">Note: Additional charges may apply for waiting time.</p>
        `;
    } else if (packageType === 'Kilometer') {
        estimatedFare = estimatedDistance * perKmRate;
        fareDetails = `
            <p class="fare-detail">Rate per km: LKR ${perKmRate.toFixed(2)}</p>
            <p class="fare-detail">Estimated distance: ${estimatedDistance} km</p>
            <p class="fare-detail">Note: Additional charges may apply for waiting time.</p>
        `;
    }
    
    // Update the fare estimate display
    fareEstimateDiv.innerHTML = `
        <h3>Fare Estimate</h3>
        <p class="fare-amount">LKR ${estimatedFare.toFixed(2)}</p>
        ${fareDetails}
    `;
    
    // Store the estimated distance for later use in booking
    document.getElementById('booking-form').dataset.estimatedDistance = estimatedDistance;
}

/**
 * Submit the booking form
 */
function submitBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    // Validate form
    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }
    
    // Get form values
    const pickupLocation = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    const passengers = document.getElementById('passengers').value;
    const notes = document.getElementById('notes').value;
    
    // Validate required fields manually
    if (!pickupLocation || !destination || !pickupDate || !pickupTime || !vehicleType) {
        showError('Please fill all required fields');
        return;
    }
    
    // Get user ID from session
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showError('Session expired. Please log in again.');
        setTimeout(() => {
            window.location.href = '../login.jsp';
        }, 2000);
        return;
    }
    
    // Create datetime string
    const pickupDateTime = `${pickupDate} ${pickupTime}`;
    
    // For this demo, we'll use a fixed car ID
    // In a real implementation, you might select a car based on availability
    const carId = 1; // Default to first car
    
    // Create booking object
    const bookingData = {
        user_id: parseInt(userId),
        package_id: parseInt(vehicleType),
        car_id: carId,
        pickup_location: pickupLocation,
        destination: destination,
        pickup_datetime: pickupDateTime,
        num_passengers: parseInt(passengers),
        notes: notes,
        status: 'Pending'
    };
    
    // Add estimated distance if available
    if (bookingForm.dataset.estimatedDistance) {
        bookingData.estimated_distance = parseFloat(bookingForm.dataset.estimatedDistance);
    }
    
    console.log('Submitting booking:', bookingData);
    
    // Disable submit button and show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Submit to API
    fetch('http://localhost:8080/mccAPI/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Booking failed with status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Booking successful:', data);
        
        // Show success message
        showSuccess('Your booking has been successfully created! Booking ID: ' + data.booking_id);
        
        // Reset form
        bookingForm.reset();
        
        // Reset form to defaults
        initializeDateTime();
        
        // Reset fare estimate
        const fareEstimateDiv = document.getElementById('fare-estimate');
        if (fareEstimateDiv) {
            fareEstimateDiv.innerHTML = `
                <h3>Fare Estimate</h3>
                <p>Select locations and package to calculate fare estimate</p>
            `;
        }
        
        // Redirect to booking history after a short delay
        setTimeout(() => {
            window.location.href = 'bookingHistory.jsp';
        }, 3000);
    })
    .catch(error => {
        console.error('Error creating booking:', error);
        showError('Failed to create booking: ' + error.message);
    })
    .finally(() => {
        // Re-enable submit button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
}

/* ===========================================
   UTILITY FUNCTIONS
   =========================================== */

/**
 * Display an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.add('show');
        
        // Add error shake animation
        errorMessageElement.classList.add('error-shake');
        setTimeout(() => {
            errorMessageElement.classList.remove('error-shake');
        }, 500);
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorMessageElement.classList.remove('show');
        }, 5000);
    } else {
        console.error('Error message element not found');
        alert('Error: ' + message);
    }
}

/**
 * Display a success message
 * @param {string} message - The success message to display
 */
function showSuccess(message) {
    const successMessageElement = document.getElementById('success-message');
    if (successMessageElement) {
        successMessageElement.textContent = message;
        successMessageElement.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMessageElement.classList.remove('show');
        }, 5000);
    } else {
        console.log('Success: ' + message);
        alert('Success: ' + message);
    }
}

/**
 * Display a welcome notification with the user's name
 * @param {string} userName - The user's name
 */
function showWelcomeNotification(userName) {
    // Create the notification element if it doesn't exist
    if (!document.getElementById('welcome-notification')) {
        const notification = document.createElement('div');
        notification.id = 'welcome-notification';
        notification.className = 'welcome-notification';
        
        // Create notification content
        notification.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="welcome-message">
                    <h3>Welcome back!</h3>
                    <p id="welcome-user-name"></p>
                </div>
                <div class="welcome-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add close button event listener
        const closeBtn = notification.querySelector('.welcome-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                notification.classList.remove('show');
                // Remove after animation completes
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            });
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove after animation completes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
    
    // Set the user name in the notification
    const userNameElement = document.getElementById('welcome-user-name');
    if (userNameElement) {
        userNameElement.textContent = `Glad to see you, ${userName}!`;
    }
    
    // Show the notification
    const notification = document.getElementById('welcome-notification');
    if (notification) {
        // Short delay to ensure CSS transition works
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }
}