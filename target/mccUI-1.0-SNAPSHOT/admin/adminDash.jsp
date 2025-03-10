<%-- 
    Document   : adminDash.jsp
    Created on : Mar 9, 2025
    Author     : Mega City Cab Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Admin Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
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
            <a href="${pageContext.request.contextPath}/admin/adminDash.jsp" class="menu-item active">
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
            <a href="${pageContext.request.contextPath}/admin/ManageBooking.jsp" class="menu-item">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManagePackge.jsp" class="menu-item">
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
            <h1 class="page-title">Dashboard</h1>
            <div class="user-info">
                <div class="user-avatar" id="userInitials">A</div>
                <div class="user-name" id="adminName">Admin</div>
                <div class="logout-btn" id="headerLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </div>
        
        <!-- Flash Message (if any) -->
        <div id="flashMessage" class="alert alert-success" style="display:none;">
            <div id="flashMessageText">Welcome to the admin dashboard!</div>
            <button class="alert-close" onclick="closeAlert(this)">&times;</button>
        </div>
        
        <!-- Dashboard Overview Cards -->
        <div class="dashboard-cards">
            <div class="card">
                <div class="card-title">
                    <span>Total Users</span>
                    <i class="fas fa-users"></i>
                </div>
                <div class="card-value" id="totalUsers">0</div>
                <div class="card-description">Registered users in the system</div>
                <div class="card-footer">
                    <i class="fas fa-arrow-up" style="color: #0bb966;"></i>
                    <span id="userGrowth">0% increase this month</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>Active Drivers</span>
                    <i class="fas fa-id-card"></i>
                </div>
                <div class="card-value" id="activeDrivers">0</div>
                <div class="card-description">Currently active drivers</div>
                <div class="card-footer">
                    <i class="fas fa-arrow-up" style="color: #0bb966;"></i>
                    <span id="driverGrowth">0 new drivers this week</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>Total Bookings</span>
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="card-value" id="totalBookings">0</div>
                <div class="card-description">Lifetime bookings</div>
                <div class="card-footer">
                    <i class="fas fa-arrow-up" style="color: #0bb966;"></i>
                    <span id="bookingGrowth">0 new bookings today</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <span>Revenue</span>
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="card-value" id="totalRevenue">$0</div>
                <div class="card-description">Total revenue this month</div>
                <div class="card-footer">
                    <i class="fas fa-arrow-up" style="color: #0bb966;"></i>
                    <span id="revenueGrowth">0% increase vs last month</span>
                </div>
            </div>
        </div>
        
        <!-- Recent Bookings Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Recent Bookings</h2>
                <a href="${pageContext.request.contextPath}/admin/ManageBooking.jsp" class="section-action">View All</a>
            </div>
            
            <table class="data-table" id="recentBookingsTable">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>User</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Booking data will be loaded dynamically via JavaScript -->
                </tbody>
            </table>
        </div>
        
        <!-- Active Drivers Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Active Drivers</h2>
                <a href="${pageContext.request.contextPath}/admin/ManageDrivers.jsp" class="section-action">View All</a>
            </div>
            
            <table class="data-table" id="activeDriversTable">
                <thead>
                    <tr>
                        <th>Driver ID</th>
                        <th>Name</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Trips</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Driver data will be loaded dynamically via JavaScript -->
                </tbody>
            </table>
        </div>
        
        <!-- System Statistics Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">System Statistics</h2>
            </div>
            
            <div class="dashboard-cards" id="statisticsCards">
                <!-- Statistics cards will be loaded dynamically via JavaScript -->
            </div>
        </div>
    </main>

    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
</body>
</html>