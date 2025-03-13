/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * driver-dashboard.js - Dashboard functionality for driver panel
 * Created on: Mar 10, 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const API_BASE_URL = "http://localhost:8080/mccAPI/api";
    const DRIVER_ENDPOINT = `${API_BASE_URL}/drivers`;
    const CAR_ENDPOINT = `${API_BASE_URL}/cars`;
    
    // Session data
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');
    const userEmail = sessionStorage.getItem('userEmail');
    
    // Redirect if not logged in as driver
    if (!userId || userRole !== 'driver') {
        window.location.href = '../login.jsp';
        return;
    }
    
    // Initialize the dashboard
    initDriverDashboard();
    
    // Setup sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('wrapper').classList.toggle('toggled');
    });
    
    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    // Setup availability toggle
    const availabilityToggle = document.getElementById('availabilityToggle');
    if (availabilityToggle) {
        availabilityToggle.addEventListener('change', function() {
            const isAvailable = this.checked;
            updateDriverAvailability(isAvailable);
            
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = isAvailable ? 'Available' : 'Unavailable';
                statusText.className = isAvailable ? 'status-available' : 'status-unavailable';
            }
        });
    }
    
    /**
     * Initialize the driver dashboard
     */
    function initDriverDashboard() {
        // Load driver info
        loadDriverInfo();
        
        // Load vehicle info
        loadVehicleInfo();
        
        // Load trip statistics
        loadTripStatistics();
    }
    
    /**
     * Load driver information
     */
    function loadDriverInfo() {
        if (!userId) return;
        
        fetch(`${DRIVER_ENDPOINT}/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load driver information');
                }
                return response.json();
            })
            .then(driver => {
                // Update driver UI elements
                updateDriverUI(driver);
                
                // Set availability toggle state
                const availabilityToggle = document.getElementById('availabilityToggle');
                if (availabilityToggle && driver.is_available !== undefined) {
                    availabilityToggle.checked = driver.is_available;
                    
                    const statusText = document.getElementById('statusText');
                    if (statusText) {
                        statusText.textContent = driver.is_available ? 'Available' : 'Unavailable';
                        statusText.className = driver.is_available ? 'status-available' : 'status-unavailable';
                    }
                }
            })
            .catch(error => {
                console.error('Error loading driver information:', error);
            });
    }
    
    /**
     * Update UI elements with driver data
     * @param {Object} driver - Driver object with driver data
     */
    function updateDriverUI(driver) {
        // Update driver name and initials
        const driverName = document.getElementById('driverName');
        const driverInitials = document.getElementById('driverInitials');
        
        if (driverName && driver.fullName) {
            driverName.textContent = driver.fullName;
        }
        
        if (driverInitials && driver.fullName) {
            driverInitials.textContent = getInitials(driver.fullName);
        }
        
        // Update driver rating
        const driverRating = document.getElementById('driverRating');
        if (driverRating) {
            driverRating.textContent = driver.rating.toFixed(1);
            
            // Update rating progress bars (dummy implementation)
            const totalRatings = 10; // Example value
            document.querySelectorAll('.rating-breakdown .progress-bar')[0].style.width = '60%';
            document.querySelectorAll('.rating-breakdown .progress-bar')[1].style.width = '30%';
            document.querySelectorAll('.rating-breakdown .progress-bar')[2].style.width = '10%';
            
            document.querySelectorAll('.rating-breakdown small')[1].textContent = '6 ratings';
            document.querySelectorAll('.rating-breakdown small')[3].textContent = '3 ratings';
            document.querySelectorAll('.rating-breakdown small')[5].textContent = '1 rating';
        }
    }
    
    /**
     * Load vehicle information for the driver
     */
    function loadVehicleInfo() {
        if (!userId) return;
        
        fetch(`${DRIVER_ENDPOINT}/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load driver information');
                }
                return response.json();
            })
            .then(driver => {
                // Check if driver has an assigned vehicle
                if (driver.car_id) {
                    return fetch(`${CAR_ENDPOINT}/${driver.car_id}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to load vehicle information');
                            }
                            return response.json();
                        });
                } else {
                    throw new Error('No vehicle assigned');
                }
            })
            .then(car => {
                // Update vehicle information UI
                const vehicleInfo = document.getElementById('vehicleInfo');
                if (vehicleInfo) {
                    vehicleInfo.innerHTML = `
                        <div class="d-flex align-items-center mb-3">
                            <div class="vehicle-icon me-3">
                                <i class="fas fa-car fa-2x text-primary"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">${car.number_plate}</h6>
                                <span class="badge bg-info">${car.category_name}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted d-block">Chassis Number</small>
                                <span>${car.chassis_number}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Status</small>
                                <span class="badge ${car.is_active ? 'bg-success' : 'bg-danger'}">
                                    ${car.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading vehicle information:', error);
                
                // Show no vehicle assigned
                const vehicleInfo = document.getElementById('vehicleInfo');
                if (vehicleInfo) {
                    vehicleInfo.innerHTML = `
                        <div class="text-center py-4 text-muted">
                            <i class="fas fa-car fa-3x mb-3"></i>
                            <p>No vehicle assigned yet</p>
                            <small>Contact admin to get a vehicle assigned</small>
                        </div>
                    `;
                }
            });
    }
    
    /**
     * Load trip statistics (dummy implementation)
     */
    function loadTripStatistics() {
        // This would typically come from an API
        // For demonstration, using dummy data
        
        // Update today's stats
        document.getElementById('tripCount').textContent = '3';
        document.getElementById('earningsToday').textContent = '$45.50';
        
        // Update weekly stats
        document.getElementById('weeklyTrips').textContent = '12';
        document.querySelector('.progress-bar').style.width = '24%'; // 12/50 = 24%
        
        // Demo upcoming trips
        const upcomingTrips = document.getElementById('upcomingTrips');
        if (upcomingTrips) {
            upcomingTrips.innerHTML = `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">Central Mall to Airport</h6>
                        <span class="badge bg-primary">15 min</span>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-user me-1"></i> John Doe
                    </small>
                </div>
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">Riverside to Downtown</h6>
                        <span class="badge bg-secondary">2:30 PM</span>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-user me-1"></i> Jane Smith
                    </small>
                </div>
            `;
        }
    }
    
    /**
     * Update driver availability status
     * @param {boolean} isAvailable - New availability status
     */
    function updateDriverAvailability(isAvailable) {
        if (!userId) return;
        
        fetch(`${DRIVER_ENDPOINT}/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load driver information');
                }
                return response.json();
            })
            .then(driver => {
                if (driver.id) {
                    return fetch(`${DRIVER_ENDPOINT}/${driver.id}/availability`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(isAvailable)
                    });
                } else {
                    throw new Error('Driver ID not found');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update availability');
                }
                return response.json();
            })
            .then(data => {
                console.log('Availability updated successfully:', data);
            })
            .catch(error => {
                console.error('Error updating availability:', error);
                
                // Revert toggle on error
                const availabilityToggle = document.getElementById('availabilityToggle');
                if (availabilityToggle) {
                    availabilityToggle.checked = !isAvailable;
                    
                    const statusText = document.getElementById('statusText');
                    if (statusText) {
                        statusText.textContent = !isAvailable ? 'Available' : 'Unavailable';
                        statusText.className = !isAvailable ? 'status-available' : 'status-unavailable';
                    }
                }
            });
    }
    
    /**
     * Get initials from a name
     * @param {string} name - Full name
     * @return {string} - Initials
     */
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    /**
     * Handle logout functionality
     */
    function handleLogout() {
        // Clear session storage
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '../login.jsp';
    }
});
function logout() {
    sessionStorage.clear();
    window.location.href = '../login.jsp';
}