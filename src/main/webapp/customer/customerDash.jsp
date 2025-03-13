<%-- 
    Document   : customerDash
    Created on : Mar 13, 2025, 4:32:02 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Dashboard - MEGA CITY CAB</title>
        <link rel="stylesheet" href="../css/index.css">
        <link rel="stylesheet" href="../css/customer.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        <header>
            <div class="logo">
                <h1>MEGA CITY CAB</h1>
            </div>
            <nav>
        <ul>
            <li><a href="customerDash.jsp" class="active">Dashboard</a></li>
            <li><a href="addBooking.jsp">Book a Ride</a></li>
            <li><a href="bookingHistory.jsp">Booking History</a></li>
            <li><a href="#" id="logout-btn">Logout</a></li>
        </ul>
    </nav>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        
        <main>
            <div class="dashboard-container">
                <div class="welcome-section">
                    <h2>Welcome, <span id="username">Customer</span>!</h2>
                    <p>Manage your rides and bookings with ease.</p>
                </div>
                
                <div class="stats-section">
                    <div class="stat-card">
                        <i class="fas fa-taxi"></i>
                        <h3>Active Bookings</h3>
                        <p id="active-bookings">0</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-history"></i>
                        <h3>Past Rides</h3>
                        <p id="past-rides">0</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <h3>Average Rating</h3>
                        <p id="avg-rating">0.0</p>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <a href="addBooking.jsp" class="action-btn">
                            <i class="fas fa-plus-circle"></i>
                            New Booking
                        </a>
                        <a href="bookingHistory.jsp" class="action-btn">
                            <i class="fas fa-history"></i>
                            View History
                        </a>
                        <a href="#" class="action-btn" id="profile-btn">
                            <i class="fas fa-user"></i>
                            Edit Profile
                        </a>
                    </div>
                </div>
                
                <div class="recent-bookings">
                    <h3>Recent Bookings</h3>
                    <div class="bookings-list" id="recent-bookings-list">
                        <!-- Bookings will be loaded here by JavaScript -->
                        <p class="loading-message">Loading your recent bookings...</p>
                    </div>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
        </footer>
        
        <script src="../js/index.js"></script>
        <script src="../js/customer.js"></script>
    </body>
</html>
