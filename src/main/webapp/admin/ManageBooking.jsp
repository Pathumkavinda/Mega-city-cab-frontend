<%-- 
    Document   : ManageBooking
    Created on : Mar 8, 2025, 2:30:58 PM
    Author     : Admin
--%>

<%-- 
    Document   : ManageBooking
    Created on : Mar 11, 2025
    Author     : Mega City Cab Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Bookings</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-booking.css">
</head>
<body>
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="${pageContext.request.contextPath}/images/mega_city_cab_logo.png" alt="Mega City Cab Logo">
            <h3>Admin Panel</h3>
        </div>
        
        <nav class="sidebar-menu">
            <div class="menu-category">Dashboard</div>
            <a href="${pageContext.request.contextPath}/admin/adminDash.jsp" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Overview
            </a>
            
            <div class="menu-category">Management</div>
            <a href="${pageContext.request.contextPath}/admin/ManageUsers.jsp" class="menu-item">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageDrivers.jsp" class="menu-item">
                <i class="fas fa-id-card"></i> Drivers
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageCars.jsp" class="menu-item">
                <i class="fas fa-car"></i> Cars
            </a>
            <a href="${pageContext.request.contextPath}/admin/Category.jsp" class="menu-item">
                <i class="fas fa-tags"></i> Category
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageBooking.jsp" class="menu-item active">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManagePackage.jsp" class="menu-item">
                <i class="fas fa-box"></i> Package
            </a>
            
            <div class="menu-category">Reports</div>
            <a href="${pageContext.request.contextPath}/admin/revenue.jsp" class="menu-item">
                <i class="fas fa-chart-line"></i> Revenue
            </a>
            <a href="${pageContext.request.contextPath}/admin/trips.jsp" class="menu-item">
                <i class="fas fa-route"></i> Trips
            </a>
            
            <div class="menu-category">Settings</div>
            <a href="${pageContext.request.contextPath}/admin/profile.jsp" class="menu-item">
                <i class="fas fa-user-cog"></i> My Profile
            </a>
            <a href="${pageContext.request.contextPath}/admin/settings.jsp" class="menu-item">
                <i class="fas fa-cogs"></i> System Settings
            </a>
            <a href="#" id="logoutBtn" class="menu-item">
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
                    <i class="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </div>
        
        <!-- Flash Message (if any) -->
        <div id="flashMessage" class="alert" style="display:none;">
            <div id="flashMessageText"></div>
            <button class="alert-close" onclick="closeAlert(this)">&times;</button>
        </div>
        
        <!-- Booking Filters Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Booking Filters</h2>
            </div>
            
            <div class="filter-container">
                <div class="filter-row">
                    <div class="filter-group">
                        <label for="statusFilter">Status</label>
                        <select id="statusFilter" onchange="applyFilters()">
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="dateFilter">Date Range</label>
                        <select id="dateFilter" onchange="toggleDateRange()">
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    
                    <div class="filter-group date-range-inputs" style="display: none;">
                        <label for="startDate">From</label>
                        <input type="date" id="startDate" onchange="applyFilters()">
                    </div>
                    
                    <div class="filter-group date-range-inputs" style="display: none;">
                        <label for="endDate">To</label>
                        <input type="date" id="endDate" onchange="applyFilters()">
                    </div>
                </div>
                
                <div class="filter-row">
                    <div class="filter-group">
                        <label for="packageFilter">Package</label>
                        <select id="packageFilter" onchange="applyFilters()">
                            <option value="all">All Packages</option>
                            <!-- Package options will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="driverFilter">Driver</label>
                        <select id="driverFilter" onchange="applyFilters()">
                            <option value="all">All Drivers</option>
                            <option value="unassigned">Unassigned</option>
                            <!-- Driver options will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="filter-group search-box">
                        <label for="searchBooking">Search</label>
                        <div class="search-input-container">
                            <input type="text" id="searchBooking" placeholder="Search by ID, name, location..." oninput="applyFilters()">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Bookings List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Bookings List</h2>
                <div class="booking-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="pendingCount">0</span>
                        <span class="stat-label">Pending</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="confirmedCount">0</span>
                        <span class="stat-label">Confirmed</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="inProgressCount">0</span>
                        <span class="stat-label">In Progress</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="completedCount">0</span>
                        <span class="stat-label">Completed</span>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="bookingsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Pickup</th>
                            <th>Destination</th>
                            <th>Date & Time</th>
                            <th>Package</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Booking data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="9" class="loading-indicator">
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

    <!-- Booking Details Modal -->
    <div class="modal" id="bookingDetailsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Booking Details</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body" id="bookingDetailsContainer">
                <!-- Booking details will be populated dynamically -->
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">Close</button>
                <button class="btn-primary" id="assignDriverBtn" style="display: none;">Assign Driver</button>
                <button class="btn-success" id="completeBookingBtn" style="display: none;">Complete Trip</button>
                <button class="btn-danger" id="cancelBookingBtn" style="display: none;">Cancel Booking</button>
            </div>
        </div>
    </div>

    <!-- Assign Driver Modal -->
    <div class="modal" id="assignDriverModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Assign Driver</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Select a driver to assign to booking <strong id="assignBookingId"></strong>:</p>
                
                <div class="form-group">
                    <label for="driverSelect">Available Drivers</label>
                    <select id="driverSelect" class="full-width">
                        <!-- Available drivers will be loaded dynamically -->
                        <option value="">Loading drivers...</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">Cancel</button>
                <button class="btn-primary" id="confirmAssignBtn">Confirm Assignment</button>
            </div>
        </div>
    </div>
    
    <!-- Complete Trip Modal -->
    <div class="modal" id="completeTripModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Complete Trip</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Enter trip completion details for booking <strong id="completeBookingId"></strong>:</p>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="actualPickupTime">Actual Pickup Time</label>
                        <input type="datetime-local" id="actualPickupTime" class="full-width">
                    </div>
                    
                    <div class="form-group">
                        <label for="completionTime">Completion Time</label>
                        <input type="datetime-local" id="completionTime" class="full-width" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="distanceTraveled">Distance Traveled (km)</label>
                        <input type="number" id="distanceTraveled" min="0" step="0.1" class="full-width" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="waitingTime">Waiting Time (minutes)</label>
                        <input type="number" id="waitingTime" min="0" class="full-width" value="0">
                    </div>
                </div>
                
                <div id="fareCalculation" class="fare-calculation">
                    <!-- Fare calculation will be displayed here -->
                    <p class="note">Fare will be calculated based on the package terms and trip details.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">Cancel</button>
                <button class="btn-primary" id="calculateFareBtn">Calculate Fare</button>
                <button class="btn-success" id="confirmCompleteBtn" style="display: none;">Complete Trip</button>
            </div>
        </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div class="modal" id="confirmModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Action</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p id="confirmMessage">Are you sure you want to proceed?</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">No</button>
                <button class="btn-primary" id="confirmActionBtn">Yes, Proceed</button>
            </div>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-booking.js"></script>
</body>
</html>
