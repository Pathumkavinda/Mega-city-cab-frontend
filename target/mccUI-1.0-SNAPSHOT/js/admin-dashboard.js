// Admin Dashboard JavaScript

// Define context path for AJAX calls
const contextPath = document.querySelector('meta[name="contextPath"]')?.getAttribute('content') || '';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start periodic checks
    startPeriodicTasks();
});

// Main Initialization
function initializeDashboard() {
    console.log("Initializing dashboard...");
    
    // Initialize Bootstrap components
    initBootstrapComponents();
    
    // Initialize notification system
    initNotifications();
    
    // Initialize data tables if present
    initDataTables();
    
    // Initialize charts if present
    initCharts();
    
    // Initialize maps if present
    initMaps();
    
    // Initialize form validation
    initFormValidation();
}

// Bootstrap Components Initialization
function initBootstrapComponents() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Setup modal handlers
    setupModalHandlers();
    
    // Setup form submission handlers
    setupFormHandlers();
    
    // Setup table action buttons
    setupTableActions();
    
    // Setup sidebar toggler if exists
    setupSidebarToggle();
    
    // Setup notification interactions
    setupNotificationActions();
}

// Periodic Tasks
function startPeriodicTasks() {
    // Check for new notifications every 30 seconds
    setInterval(checkForNewAlerts, 30000);
    
    // Update live statistics every minute if needed
    setInterval(updateLiveStatistics, 60000);
    
    // Update driver locations on map every 10 seconds if map is visible
    if (document.getElementById('driversMapContainer')) {
        setInterval(updateDriverLocations, 10000);
    }
}

/* ===== NOTIFICATION SYSTEM ===== */

// Initialize Notification System
function initNotifications() {
    console.log("Initializing notification system...");
    
    // Check notification badge visibility
    updateNotificationBadgeVisibility();
    
    // Setup notification mark as read functionality
    setupNotificationMarkAsRead();
}

// Update notification badge visibility
function updateNotificationBadgeVisibility() {
    const counter = document.querySelector('.notification-counter');
    if (counter) {
        const count = parseInt(counter.textContent || '0');
        if (count <= 0) {
            counter.classList.add('d-none');
        } else {
            counter.classList.remove('d-none');
        }
    }
}

// Setup notification mark as read functionality
function setupNotificationMarkAsRead() {
    // Individual notification click
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.dropdown-item-action')) return; // Don't mark as read if clicking action button
            
            e.preventDefault();
            
            // Get notification ID
            const notificationId = this.getAttribute('data-notification-id');
            
            // Mark as read via AJAX
            markNotificationAsRead(notificationId);
            
            // Update UI immediately
            this.classList.remove('notification-new');
            decrementNotificationCounter();
        });
    });
    
    // Mark all as read button
    const markAllReadBtn = document.getElementById('markAllAsReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            markAllNotificationsAsRead();
        });
    }
}

// Mark a single notification as read
function markNotificationAsRead(notificationId) {
    // Send AJAX request to mark notification as read
    fetch(`${contextPath}/admin/notifications/markAsRead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `notificationId=${notificationId}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Notification marked as read:', data);
    })
    .catch(error => {
        console.error('Error marking notification as read:', error);
    });
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    // Send AJAX request to mark all notifications as read
    fetch(`${contextPath}/admin/notifications/markAllAsRead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('All notifications marked as read:', data);
        
        // Update UI
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.remove('notification-new');
        });
        
        // Reset notification counter
        const counter = document.querySelector('.notification-counter');
        if (counter) {
            counter.textContent = '0';
            counter.classList.add('d-none');
        }
        
        // Show success message
        showToast('Success', 'All notifications marked as read', 'success');
    })
    .catch(error => {
        console.error('Error marking all notifications as read:', error);
        showToast('Error', 'Could not mark notifications as read', 'danger');
    });
}

// Decrement notification counter
function decrementNotificationCounter() {
    const counter = document.querySelector('.notification-counter');
    if (counter) {
        const currentCount = parseInt(counter.textContent || '0');
        if (currentCount > 0) {
            const newCount = currentCount - 1;
            counter.textContent = newCount.toString();
            
            if (newCount <= 0) {
                counter.classList.add('d-none');
            }
        }
    }
}

// Setup notification actions
function setupNotificationActions() {
    document.querySelectorAll('.dropdown-item-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent parent notification from being marked as read
            
            // Handle specific action based on data attribute
            const action = this.getAttribute('data-action');
            const notificationId = this.closest('.notification-item').getAttribute('data-notification-id');
            
            console.log(`Action ${action} for notification ${notificationId}`);
            
            // Implement specific actions here
            switch(action) {
                case 'view':
                    // View details action
                    break;
                case 'dismiss':
                    // Dismiss notification action
                    break;
                // Add more actions as needed
            }
        });
    });
}

// Add a new notification to the UI
function addNewNotification(notification) {
    const notificationList = document.querySelector('.notification-panel .list-group');
    if (!notificationList) return;
    
    // Create notification element
    const notificationEl = document.createElement('a');
    notificationEl.className = `list-group-item list-group-item-action notification-item ${notification.type} notification-new`;
    notificationEl.href = '#';
    notificationEl.setAttribute('data-notification-id', notification.id);
    
    notificationEl.innerHTML = `
        <div class="d-flex justify-content-between">
            <div>${notification.message}</div>
            <div class="notification-time">${notification.time}</div>
        </div>
    `;
    
    // Add to the top of the list
    notificationList.prepend(notificationEl);
    
    // Update notification counter
    incrementNotificationCounter();
    
    // Show toast notification
    showToast('New notification', notification.message, notification.type);
    
    // Add event listener
    notificationEl.addEventListener('click', function(e) {
        if (e.target.closest('.dropdown-item-action')) return; // Don't mark as read if clicking action button
        
        e.preventDefault();
        this.classList.remove('notification-new');
        decrementNotificationCounter();
        
        // Mark as read via AJAX
        const notificationId = this.getAttribute('data-notification-id');
        markNotificationAsRead(notificationId);
    });
}

// Increment notification counter
function incrementNotificationCounter() {
    const counter = document.querySelector('.notification-counter');
    if (counter) {
        const currentCount = parseInt(counter.textContent || '0');
        const newCount = currentCount + 1;
        counter.textContent = newCount.toString();
        counter.classList.remove('d-none');
    }
}

// Check for new alerts periodically
function checkForNewAlerts() {
    // In a real application, this would make an AJAX request to check for new notifications
    console.log("Checking for new alerts...");
    
    // Simulate occasional new notification for demonstration
    if (Math.random() > 0.7) { // 30% chance of new notification
        // Create a notification with random type
        const types = ['info', 'warning', 'danger'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Simulate new notification
        const messages = [
            'New booking received from customer',
            'Driver reported an issue with vehicle',
            'Payment failed for booking #BK12350',
            'New driver application submitted',
            'Customer left a new review'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Add the notification to UI (in a real app, this would come from the server)
        addNewNotification({
            id: 'N' + Math.floor(Math.random() * 1000),
            message: randomMessage,
            time: 'just now',
            type: randomType
        });
    }
}

/* ===== MODAL HANDLERS ===== */

// Setup modal event handlers
function setupModalHandlers() {
    // Trip Details Modal
    const tripDetailsModal = document.getElementById('tripDetailsModal');
    if (tripDetailsModal) {
        tripDetailsModal.addEventListener('show.bs.modal', function(event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract trip ID from data-* attributes
            const tripId = button.getAttribute('data-trip-id');
            
            // Update the modal's content
            const modalTitle = this.querySelector('.modal-title');
            modalTitle.textContent = 'Trip Request Details: #' + tripId;
            
            // Fetch trip details from the server
            fetchTripDetails(tripId, this);
        });
    }
    
    // Assign Driver Modal
    const assignDriverModal = document.getElementById('assignDriverModal');
    if (assignDriverModal) {
        assignDriverModal.addEventListener('show.bs.modal', function(event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract trip ID from data-* attributes
            const tripId = button.getAttribute('data-trip-id');
            
            // Update the modal's content
            const modalTitle = this.querySelector('.modal-title');
            modalTitle.textContent = 'Assign Driver to Trip #' + tripId;
            
            // Set the trip ID on the assign button
            const assignBtn = this.querySelector('#assignDriverBtn');
            if (assignBtn) {
                assignBtn.setAttribute('data-trip-id', tripId);
            }
            
            // Fetch available drivers from the server
            fetchAvailableDrivers(this);
        });
    }
    
    // Driver Details Modal
    const driverDetailsModal = document.getElementById('driverDetailsModal');
    if (driverDetailsModal) {
        driverDetailsModal.addEventListener('show.bs.modal', function(event) {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract driver ID from data-* attributes
            const driverId = button.getAttribute('data-driver-id');
            
            // Update the modal's content
            const modalTitle = this.querySelector('.modal-title');
            modalTitle.textContent = 'Driver Details: #' + driverId;
            
            // Fetch driver details from the server
            fetchDriverDetails(driverId, this);
        });
    }
}

// Fetch trip details and update modal
function fetchTripDetails(tripId, modalElement) {
    // Show loading state
    const detailsContainer = modalElement.querySelector('.modal-body');
    if (detailsContainer) {
        detailsContainer.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading trip details...</p></div>';
    }
    
    // In a real application, this would make an AJAX request to fetch trip details
    // For demonstration, simulate a loading delay and then populate with dummy data
    setTimeout(() => {
        if (detailsContainer) {
            // Populate with dummy data (in a real app, this would be data from the server)
            detailsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label text-muted">Trip ID</label>
                            <div class="fw-bold">#${tripId}</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Customer</label>
                            <div class="fw-bold">John Doe</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Contact</label>
                            <div class="fw-bold">+1 (555) 123-4567</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Pickup Location</label>
                            <div class="fw-bold">Downtown, 123 Main St</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Destination</label>
                            <div class="fw-bold">Airport Terminal 2</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label text-muted">Date & Time</label>
                            <div class="fw-bold">Mar 9, 2025 at 10:30 AM</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Vehicle Type</label>
                            <div class="fw-bold">Sedan</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Estimated Fare</label>
                            <div class="fw-bold">$25.00</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Distance</label>
                            <div class="fw-bold">8.5 km</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Payment Method</label>
                            <div class="fw-bold">Credit Card (Visa ending in 4567)</div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">Special Notes</label>
                    <div class="p-2 bg-light rounded">
                        Need help with 2 large suitcases. Please arrive 5 minutes early.
                    </div>
                </div>
                <div class="mb-0">
                    <label class="form-label text-muted">Trip Status</label>
                    <select class="form-select trip-status-select" data-trip-id="${tripId}">
                        <option selected>Pending</option>
                        <option>Assigned</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            `;
            
            // Re-initialize event handlers for the newly added content
            document.querySelectorAll('.trip-status-select').forEach(select => {
                select.addEventListener('change', function() {
                    const tripId = this.getAttribute('data-trip-id');
                    const newStatus = this.value;
                    console.log(`Status for trip #${tripId} changed to ${newStatus}`);
                    
                    // This would trigger an AJAX call in a real application
                    updateTripStatus(tripId, newStatus);
                });
            });
        }
    }, 1000);
}

// Fetch available drivers and update modal
function fetchAvailableDrivers(modalElement) {
    const driverSelect = modalElement.querySelector('#driverSelect');
    
    if (driverSelect) {
        // Clear existing options except the placeholder
        while (driverSelect.options.length > 1) {
            driverSelect.remove(1);
        }
        
        // Show loading state
        const loadingOption = document.createElement('option');
        loadingOption.text = 'Loading drivers...';
        loadingOption.disabled = true;
        driverSelect.add(loadingOption);
        driverSelect.value = '';
        
        // In a real application, this would make an AJAX request to fetch available drivers
        // For demonstration, simulate a loading delay and then populate with dummy data
        setTimeout(() => {
            // Remove loading option
            driverSelect.remove(driverSelect.options.length - 1);
            
            // Add available drivers (in a real app, these would come from the server)
            const drivers = [
                { id: 'DR001', name: 'Michael Johnson', vehicle: 'Toyota Camry', location: 'Downtown' },
                { id: 'DR002', name: 'Sarah Williams', vehicle: 'Honda Civic', location: 'West Side' },
                { id: 'DR005', name: 'David Chen', vehicle: 'Tesla Model 3', location: 'North End' },
                { id: 'DR008', name: 'Karen Miller', vehicle: 'Ford Escape', location: 'East District' }
            ];
            
            drivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.id;
                option.text = `${driver.name} - ${driver.vehicle} (${driver.location})`;
                driverSelect.add(option);
            });
        }, 800);
    }
}

/* ===== FORM HANDLERS ===== */

// Setup form submission handlers
function setupFormHandlers() {
    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Driver assignment form
    const assignDriverBtn = document.getElementById('assignDriverBtn');
    if (assignDriverBtn) {
        assignDriverBtn.addEventListener('click', function() {
            const tripId = this.getAttribute('data-trip-id');
            const driverSelect = document.getElementById('driverSelect');
            const driverId = driverSelect ? driverSelect.value : '';
            
            if (!driverId) {
                showToast('Warning', 'Please select a driver', 'warning');
                return;
            }
            
            assignDriverToTrip(tripId, driverId);
        });
    }
    
    // Driver status toggle
    document.querySelectorAll('.driver-status-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const driverId = this.getAttribute('data-driver-id');
            const isActive = this.checked;
            
            updateDriverStatus(driverId, isActive);
        });
    });
}

// Update trip status
function updateTripStatus(tripId, newStatus) {
    // In a real application, this would make an AJAX request to update trip status
    console.log(`Updating trip #${tripId} status to ${newStatus}`);
    
    // Simulate API call with a short delay
    setTimeout(() => {
        // Show success message
        showToast('Success', `Trip #${tripId} status updated to ${newStatus}`, 'success');
        
     // Update UI if needed
        updateTripStatusUI(tripId, newStatus);
    }, 500);
}

// Update driver status
function updateDriverStatus(driverId, isActive) {
    // In a real application, this would make an AJAX request to update driver status
    console.log(`Updating driver #${driverId} status to ${isActive ? 'active' : 'inactive'}`);
    
    // Simulate API call with a short delay
    setTimeout(() => {
        // Show success message
        showToast('Success', `Driver #${driverId} status updated to ${isActive ? 'active' : 'inactive'}`, 'success');
        
        // Update UI if needed
        updateDriverStatusUI(driverId, isActive);
    }, 500);
}

// Assign driver to trip
function assignDriverToTrip(tripId, driverId) {
    // Get additional form data if needed
    const pickupTimeInput = document.getElementById('estimatedPickupTime');
    const notesInput = document.getElementById('driverNotes');
    
    const pickupTime = pickupTimeInput ? pickupTimeInput.value : '';
    const notes = notesInput ? notesInput.value : '';
    
    // In a real application, this would make an AJAX request to assign the driver
    console.log(`Assigning driver #${driverId} to trip #${tripId}`);
    console.log(`Pickup time: ${pickupTime}`);
    console.log(`Notes: ${notes}`);
    
    // Simulate API call with a short delay
    setTimeout(() => {
        // Show success message
        showToast('Success', `Driver #${driverId} assigned to trip #${tripId}`, 'success');
        
        // Close the modal
        const modal = document.getElementById('assignDriverModal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
        
        // Update UI if needed
        updateTripStatusUI(tripId, 'Assigned');
    }, 800);
}

/* ===== TABLE ACTIONS ===== */

// Setup table action buttons
function setupTableActions() {
    // View details buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const entityType = this.getAttribute('data-entity-type');
            const entityId = this.getAttribute('data-entity-id');
            
            console.log(`View details for ${entityType} #${entityId}`);
            
            // Depending on entity type, open appropriate modal or page
            switch(entityType) {
                case 'trip':
                    // Open trip details modal
                    const tripModal = new bootstrap.Modal(document.getElementById('tripDetailsModal'));
                    if (tripModal) {
                        // Set data attribute for the modal to use
                        document.getElementById('tripDetailsModal').querySelector('.modal-dialog').setAttribute('data-trip-id', entityId);
                        tripModal.show();
                    }
                    break;
                
                case 'driver':
                    // Open driver details modal or redirect to driver details page
                    window.location.href = `${contextPath}/admin/drivers/view?id=${entityId}`;
                    break;
                
                case 'user':
                    // Open user details page
                    window.location.href = `${contextPath}/admin/users/view?id=${entityId}`;
                    break;
                
                case 'vehicle':
                    // Open vehicle details page
                    window.location.href = `${contextPath}/admin/vehicles/view?id=${entityId}`;
                    break;
            }
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const entityType = this.getAttribute('data-entity-type');
            const entityId = this.getAttribute('data-entity-id');
            
            console.log(`Edit ${entityType} #${entityId}`);
            
            // Redirect to edit page for the specific entity
            window.location.href = `${contextPath}/admin/${entityType}s/edit?id=${entityId}`;
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const entityType = this.getAttribute('data-entity-type');
            const entityId = this.getAttribute('data-entity-id');
            
            console.log(`Delete ${entityType} #${entityId}`);
            
            // Confirm before deletion
            if (confirm(`Are you sure you want to delete this ${entityType}? This action cannot be undone.`)) {
                deleteEntity(entityType, entityId);
            }
        });
    });
}

// Delete entity function
function deleteEntity(entityType, entityId) {
    // In a real application, this would make an AJAX request to delete the entity
    console.log(`Deleting ${entityType} #${entityId}`);
    
    // Simulate API call with a short delay
    setTimeout(() => {
        // Show success message
        showToast('Success', `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} #${entityId} has been deleted`, 'success');
        
        // Remove entity from UI or refresh page
        const row = document.querySelector(`tr[data-${entityType}-id="${entityId}"]`);
        if (row) {
            row.remove();
        } else {
            // If row not found, refresh the page
            window.location.reload();
        }
    }, 800);
}

/* ===== UI UPDATES ===== */

// Update trip status in the UI
function updateTripStatusUI(tripId, newStatus) {
    // Find all elements that show this trip's status
    document.querySelectorAll(`.trip-status[data-trip-id="${tripId}"]`).forEach(statusElement => {
        // Update text content
        statusElement.textContent = newStatus;
        
        // Update classes
        statusElement.classList.remove('bg-warning', 'bg-success', 'bg-danger', 'bg-info');
        
        // Add appropriate class based on new status
        switch(newStatus.toLowerCase()) {
            case 'pending':
                statusElement.classList.add('bg-warning');
                break;
            case 'assigned':
                statusElement.classList.add('bg-info');
                break;
            case 'in progress':
                statusElement.classList.add('bg-primary');
                break;
            case 'completed':
                statusElement.classList.add('bg-success');
                break;
            case 'cancelled':
                statusElement.classList.add('bg-danger');
                break;
        }
    });
    
    // Also update in trip list if present
    const tripRow = document.querySelector(`tr[data-trip-id="${tripId}"]`);
    if (tripRow) {
        const statusCell = tripRow.querySelector('.trip-status-cell');
        if (statusCell) {
            // Update badge
            const badge = statusCell.querySelector('.badge');
            if (badge) {
                badge.textContent = newStatus;
                badge.classList.remove('bg-warning', 'bg-success', 'bg-danger', 'bg-info', 'bg-primary');
                
                // Add appropriate class based on new status
                switch(newStatus.toLowerCase()) {
                    case 'pending':
                        badge.classList.add('bg-warning');
                        break;
                    case 'assigned':
                        badge.classList.add('bg-info');
                        break;
                    case 'in progress':
                        badge.classList.add('bg-primary');
                        break;
                    case 'completed':
                        badge.classList.add('bg-success');
                        break;
                    case 'cancelled':
                        badge.classList.add('bg-danger');
                        break;
                }
            }
        }
    }
}

// Update driver status in the UI
function updateDriverStatusUI(driverId, isActive) {
    // Find all elements that show this driver's status
    document.querySelectorAll(`.driver-status[data-driver-id="${driverId}"]`).forEach(statusElement => {
        // Update text content
        statusElement.textContent = isActive ? 'Active' : 'Inactive';
        
        // Update classes
        statusElement.classList.remove('bg-success', 'bg-danger');
        statusElement.classList.add(isActive ? 'bg-success' : 'bg-danger');
    });
    
    // Also update in driver list if present
    const driverRow = document.querySelector(`tr[data-driver-id="${driverId}"]`);
    if (driverRow) {
        const statusCell = driverRow.querySelector('.driver-status-cell');
        if (statusCell) {
            // Update badge
            const badge = statusCell.querySelector('.badge');
            if (badge) {
                badge.textContent = isActive ? 'Active' : 'Inactive';
                badge.classList.remove('bg-success', 'bg-danger');
                badge.classList.add(isActive ? 'bg-success' : 'bg-danger');
            }
        }
    }
    
    // Update toggle switches if present
    document.querySelectorAll(`.driver-status-toggle[data-driver-id="${driverId}"]`).forEach(toggle => {
        toggle.checked = isActive;
    });
}

/* ===== DATA TABLES ===== */

// Initialize data tables
function initDataTables() {
    // Check if DataTable library is available
    if (typeof $.fn.DataTable !== 'undefined') {
        // Initialize any tables with data-datatable attribute
        $('table[data-datatable="true"]').each(function() {
            $(this).DataTable({
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records..."
                },
                dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex align-items-center"l<"ms-3"f>>><"table-responsive"t><"d-flex justify-content-between align-items-center mt-3"<"text-muted"i><"pagination-container"p>>',
                lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ]
            });
        });
    }
}

/* ===== CHARTS ===== */

// Initialize charts
function initCharts() {
    // Revenue Chart
    const revenueChartCanvas = document.getElementById('revenueChart');
    if (revenueChartCanvas && typeof Chart !== 'undefined') {
        const revenueCtx = revenueChartCanvas.getContext('2d');
        
        // Sample data - in a real app, this would come from the server
        const revenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [12500, 15000, 18000, 16000, 21000, 25000, 24000, 27000, 30000, 29000, 32000, 35000],
                backgroundColor: 'rgba(58, 123, 213, 0.1)',
                borderColor: 'rgba(58, 123, 213, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
        
        new Chart(revenueCtx, {
            type: 'line',
            data: revenueData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Revenue: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Trips Chart
    const tripsChartCanvas = document.getElementById('tripsChart');
    if (tripsChartCanvas && typeof Chart !== 'undefined') {
        const tripsCtx = tripsChartCanvas.getContext('2d');
        
        // Sample data - in a real app, this would come from the server
        const tripsData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Completed Trips',
                data: [120, 150, 180, 160, 210, 250, 240, 270, 300, 290, 320, 350],
                backgroundColor: 'rgba(11, 185, 102, 0.1)',
                borderColor: 'rgba(11, 185, 102, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }, {
                label: 'Cancelled Trips',
                data: [20, 25, 30, 15, 18, 22, 19, 25, 28, 30, 32, 35],
                backgroundColor: 'rgba(255, 92, 92, 0.1)',
                borderColor: 'rgba(255, 92, 92, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
        
        new Chart(tripsCtx, {
            type: 'line',
            data: tripsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Drivers Pie Chart
    const driversPieChartCanvas = document.getElementById('driversPieChart');
    if (driversPieChartCanvas && typeof Chart !== 'undefined') {
        const driversPieCtx = driversPieChartCanvas.getContext('2d');
        
        // Sample data - in a real app, this would come from the server
        const driversPieData = {
            labels: ['Active', 'On Trip', 'Idle', 'Offline'],
            datasets: [{
                data: [42, 28, 15, 35],
                backgroundColor: [
                    'rgba(11, 185, 102, 0.8)',
                    'rgba(58, 123, 213, 0.8)',
                    'rgba(255, 171, 45, 0.8)',
                    'rgba(177, 177, 177, 0.8)'
                ],
                borderColor: [
                    'rgba(11, 185, 102, 1)',
                    'rgba(58, 123, 213, 1)',
                    'rgba(255, 171, 45, 1)',
                    'rgba(177, 177, 177, 1)'
                ],
                borderWidth: 1
            }]
        };
        
        new Chart(driversPieCtx, {
            type: 'pie',
            data: driversPieData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

/* ===== MAPS ===== */

// Initialize maps
function initMaps() {
    const mapContainer = document.getElementById('driversMapContainer');
    
    if (mapContainer && typeof google !== 'undefined' && google.maps) {
        console.log("Initializing drivers map...");
        
        // Create the map
        const map = new google.maps.Map(mapContainer, {
            center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
            zoom: 12,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#3a7bd5"}, {"visibility": "on"}]
                }
            ]
        });
        
        // Sample driver locations - in a real app, these would come from the server
        const driverLocations = [
            { id: 'DR001', name: 'Michael Johnson', vehicle: 'Toyota Camry', location: { lat: 40.7128, lng: -74.0060 }, status: 'active' },
            { id: 'DR002', name: 'Sarah Williams', vehicle: 'Honda Civic', location: { lat: 40.7282, lng: -73.9942 }, status: 'active' },
            { id: 'DR003', name: 'David Brown', vehicle: 'Ford Fusion', location: { lat: 40.7031, lng: -74.0124 }, status: 'on-trip' },
            { id: 'DR004', name: 'Lisa Garcia', vehicle: 'Hyundai Sonata', location: { lat: 40.7195, lng: -73.9870 }, status: 'active' }
        ];
        
        // Create markers for each driver
        driverLocations.forEach(driver => {
            const markerColor = driver.status === 'active' ? '#0bb966' : '#3a7bd5';
            
            const marker = new google.maps.Marker({
                position: driver.location,
                map: map,
                title: driver.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: markerColor,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                },
                driverId: driver.id
            });
            
            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="width: 200px; padding: 5px;">
                        <h6 style="margin: 0 0 5px 0;">${driver.name}</h6>
                        <p style="margin: 0 0 5px 0;"><strong>Vehicle:</strong> ${driver.vehicle}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Status:</strong> ${driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}</p>
                        <button class="view-driver-btn" data-driver-id="${driver.id}" style="background-color: #3a7bd5; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">View Details</button>
                    </div>
                `
            });
            
            // Add click event to marker
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
            
            // Store marker reference for future updates
            marker.driverId = driver.id;
            
            // After info window is opened, add event listener to the button
            google.maps.event.addListener(infoWindow, 'domready', () => {
                document.querySelector('.view-driver-btn').addEventListener('click', function() {
                    const driverId = this.getAttribute('data-driver-id');
                    console.log(`View details for driver #${driverId}`);
                    
                    // Redirect to driver details page
                    window.location.href = `${contextPath}/admin/drivers/view?id=${driverId}`;
                });
            });
        });
    } else if (mapContainer) {
        // Fallback if Google Maps API is not loaded
        mapContainer.innerHTML = '<div class="text-center py-5"><i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i><p>Map integration unavailable</p></div>';
    }
}

// Update driver locations on the map
function updateDriverLocations() {
    // This would make an AJAX request to get updated driver locations in a real application
    console.log("Updating driver locations on map...");
    
    // In a real application, we would update the marker positions based on new data
    // For demonstration, we'll simulate movement by slightly changing positions
    
    // Assuming Google Maps is loaded and we have markers with driverId properties
    if (typeof google !== 'undefined' && google.maps) {
        // Get all markers on the map
        const map = document.getElementById('driversMapContainer').map;
        if (map) {
            map.markers.forEach(marker => {
                // Get current position
                const position = marker.getPosition();
                
                // Generate small random movement
                const lat = position.lat() + (Math.random() - 0.5) * 0.002;
                const lng = position.lng() + (Math.random() - 0.5) * 0.002;
                
                // Update marker position with animation
                marker.setPosition(new google.maps.LatLng(lat, lng));
            });
        }
    }
}

/* ===== LIVE STATISTICS ===== */

// Update live statistics
function updateLiveStatistics() {
    // This would make an AJAX request to get updated statistics in a real application
    console.log("Updating live statistics...");
    
    // For demonstration, we'll simulate updating statistics with random changes
    
    // Helper function to update a statistic with random change
    function updateStat(elementId, currentValue, minChange, maxChange, prefix = '', suffix = '', minValue = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            // Parse current value
            let value = currentValue;
            if (!value) {
                const currentText = element.textContent;
                value = parseFloat(currentText.replace(/[^\d.-]/g, ''));
            }
            
            // Generate random change
            const change = minChange + Math.random() * (maxChange - minChange);
            let newValue = Math.max(minValue, value + change);
            
            // Round to appropriate precision
            if (newValue > 1000) {
                newValue = Math.round(newValue);
            } else if (newValue > 100) {
                newValue = Math.round(newValue * 10) / 10;
            } else {
                newValue = Math.round(newValue * 100) / 100;
            }
            
            // Update element
            element.textContent = `${prefix}${newValue.toLocaleString()}${suffix}`;
            
            return newValue;
        }
        return currentValue;
    }
    
    // Update active drivers count
    updateStat('activeDriversCount', null, -2, 3, '', '', 0);
    
    // Update current bookings
    updateStat('currentBookingsCount', null, -5, 8, '', '', 0);
    
    // Update revenue
    updateStat('todayRevenueValue', null, -100, 200, '$', '', 0);
    
    // Update average response time
    updateStat('avgResponseTime', null, -0.2, 0.2, '', ' min', 0.5);
}

/* ===== UI UTILITIES ===== */

// Setup sidebar toggle
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
}

// Display toast notification
function showToast(title, message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}:</strong> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastEl);
    
    // Initialize Bootstrap toast and show it
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Remove toast from DOM after hiding
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

// Export utility functions for use in other scripts
window.adminDashboard = {
    showToast,
    updateTripStatusUI,
    updateDriverStatusUI,
    fetchTripDetails,
    fetchDriverDetails: function() {}, // Placeholder
    refreshData: function() {
        window.location.reload();
    }
};
function logout() {
    sessionStorage.clear();
    window.location.href = '../login.jsp';
}