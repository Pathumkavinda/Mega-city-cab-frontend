<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Manager - MegaCity Cabs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   <link rel="stylesheet" href="../css/admin-dashboard.css">
    <link rel="stylesheet" href="../css/bookingManager.css">
    <script defer src="../js/admin.js"></script>
    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
</head>
<body>
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="../images/mega_city_cab_logo.png" alt="MegaCity Cabs Logo">
            <h3>Admin Panel</h3>
        </div>
        
        <nav class="sidebar-menu">
            <div class="menu-category">Dashboard</div>
            <a href="adminDash.jsp" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Overview
            </a>
            
            <div class="menu-category">Management</div>
            <a href="userManager.jsp" class="menu-item">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="driverManager.jsp" class="menu-item">
                <i class="fas fa-id-card"></i> Drivers
            </a>
            <a href="vehicleManager.jsp" class="menu-item">
                <i class="fas fa-car"></i> Vehicles
            </a>
            <a href="categoryManager.jsp" class="menu-item">
                <i class="fas fa-tags"></i> Categories
            </a>
            <a href="bookingManager.jsp" class="menu-item active">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            
            <div class="menu-category">Settings</div>
            <a href="adminProfile.jsp" class="menu-item">
                <i class="fas fa-user-cog"></i> My Profile
            </a>
            <a href="../login.jsp" id="logoutBtn" class="menu-item">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
        <!-- Page Header -->
        <div class="page-header">
            <h1 class="page-title">Manage Bookings</h1>
            <div class="user-info">
                <div class="user-avatar" id="userInitials">A</div>
                <div class="user-name" id="adminName">Admin</div>
                <div class="logout-btn" id="headerLogoutBtn">
                 
                </div>
            </div>
        </div>
        
        <!-- Flash Message (if any) -->
        <div id="flashMessage" class="alert" style="display:none;">
            <div id="flashMessageText"></div>
            <button class="alert-close" onclick="closeAlert(this)">&times;</button>
        </div>
        
        <!-- Booking Stats Section -->
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="stat-info">
                    <h3 id="totalBookings">0</h3>
                    <p>Total Bookings</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon active">
                    <i class="fas fa-car"></i>
                </div>
                <div class="stat-info">
                    <h3 id="activeBookings">0</h3>
                    <p>Active Bookings</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon completed">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3 id="completedBookings">0</h3>
                    <p>Completed</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3 id="pendingBookings">0</h3>
                    <p>Pending</p>
                </div>
            </div>
        </div>
        
        <!-- Bookings List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Bookings List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterStatus" onchange="filterBookings()">
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        
                        
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search by user, location..." onkeyup="filterBookings()">
                    </div>
                    <button class="btn btn-primary" id="exportBtn">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="bookingsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Start Location</th>
                            <th>Destination</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Pickup Time</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Rating</th>
                           
                        </tr>
                    </thead>
                    <tbody id="bookingTableBody">
                        <!-- Booking data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="8" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading bookings...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" id="bookingsPagination">
                <!-- Pagination will be generated dynamically -->
            </div>
        </div>
    </main>

    <!-- View Booking Details Modal -->
    <div class="modal" id="viewBookingModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Booking Details</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-id-section">
                    <span class="booking-label">Booking ID</span>
                    <span class="booking-id" id="viewBookingId">100245</span>
                    <span class="status-badge pending" id="viewBookingStatus">Pending</span>
                </div>
                
                <div class="booking-user-section">
                    <div class="user-avatar-medium" id="viewUserInitials">JD</div>
                    <div class="user-details">
                        <div class="user-name" id="viewUserName">John Doe</div>
                        <div class="user-contact">
                            <span id="viewUserEmail">john.doe@example.com</span>
                            <span id="viewUserPhone">+94 77 123 4567</span>
                        </div>
                    </div>
                </div>
                
                <div class="booking-details-grid">
                    <div class="booking-detail-row">
                        <div class="detail-column">
                            <div class="detail-label">Pickup Location</div>
                            <div class="detail-value" id="viewPickupLocation">123 Main St, Colombo</div>
                        </div>
                        <div class="detail-column">
                            <div class="detail-label">Destination</div>
                            <div class="detail-value" id="viewDestination">456 Central Ave, Kandy</div>
                        </div>
                    </div>
                    
                    <div class="booking-detail-row">
                        <div class="detail-column">
                            <div class="detail-label">Start Date</div>
                            <div class="detail-value" id="viewStartDate">March 15, 2025</div>
                        </div>
                        <div class="detail-column">
                            <div class="detail-label">End Date</div>
                            <div class="detail-value" id="viewEndDate">March 16, 2025</div>
                        </div>
                    </div>
                    
                    <div class="booking-detail-row">
                        <div class="detail-column">
                            <div class="detail-label">Pickup Time</div>
                            <div class="detail-value" id="viewPickupTime">09:30 AM</div>
                        </div>
                        <div class="detail-column">
                            <div class="detail-label">Booking Created</div>
                            <div class="detail-value" id="viewBookingCreated">March 10, 2025</div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-allocation-section">
                    <h4>Allocation Details</h4>
                    <div class="allocation-row">
                        <div class="allocation-icon vehicle">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="allocation-details">
                            <div class="allocation-title">Vehicle</div>
                            <div class="allocation-value" id="viewVehicle">Toyota Camry (CAB-1234)</div>
                            <div class="allocation-meta" id="viewCategory">Premium Sedan</div>
                        </div>
                    </div>
                    
                    <div class="allocation-row">
                        <div class="allocation-icon driver">
                            <i class="fas fa-id-card"></i>
                        </div>
                        <div class="allocation-details">
                            <div class="allocation-title">Driver</div>
                            <div class="allocation-value" id="viewDriver">Mark Johnson</div>
                            <div class="allocation-meta" id="viewDriverContact">+94 77 987 6543</div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-price-section">
                    <h4>Price Breakdown</h4>
                    <div class="price-row">
                        <div class="price-label">Base Fare</div>
                        <div class="price-value" id="viewBaseFare">₹1,500.00</div>
                    </div>
                    <div class="price-row">
                        <div class="price-label">Distance Charge</div>
                        <div class="price-value" id="viewDistanceCharge">₹750.00</div>
                    </div>
                    <div class="price-row">
                        <div class="price-label">Additional Charges</div>
                        <div class="price-value" id="viewAdditionalCharges">₹200.00</div>
                    </div>
                    <div class="price-row total">
                        <div class="price-label">Final Price</div>
                        <div class="price-value" id="viewFinalPrice">₹2,450.00</div>
                    </div>
                </div>
                
                <div class="booking-notes" id="viewBookingNotes">
                    <h4>Notes</h4>
                    <p>Customer requested child seat. Prefers a quiet driver.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
                <div class="action-buttons">
                    <button class="btn btn-danger" id="cancelBookingBtn">
                        <i class="fas fa-times-circle"></i> Cancel Booking
                    </button>
                    <button class="btn btn-success" id="updateStatusBtn">
                        <i class="fas fa-check-circle"></i> Update Status
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Update Booking Status Modal -->
    <div class="modal" id="updateStatusModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Update Booking Status</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Update status for booking <strong id="updateBookingId">100245</strong></p>
                
                <div class="form-group">
                    <label for="bookingStatus">Status</label>
                    <select id="bookingStatus">
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="statusNotes">Add Note (Optional)</label>
                    <textarea id="statusNotes" rows="3" placeholder="Add a note explaining this status change..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="confirmStatusBtn">
                    <i class="fas fa-check"></i> Update Status
                </button>
            </div>
        </div>
    </div>
</body>
</html>