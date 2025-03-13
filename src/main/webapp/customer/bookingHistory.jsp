<%-- 
    Document   : bookingHistory
    Created on : Mar 12, 2025, 2:25:00 PM
    Author     : Admin
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking History - MEGA CITY CAB</title>
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
            <div class="history-container">
                <h2>Your Booking History</h2>
                
                <div class="filter-section">
                    <div class="search-box">
                        <input type="text" id="search-bookings" placeholder="Search bookings...">
                        <button id="search-btn"><i class="fas fa-search"></i></button>
                    </div>
                    <div class="filter-options">
                        <select id="status-filter">
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                        </select>
                        <select id="date-filter">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
                
                <div class="booking-history-list" id="booking-history-list">
                    <!-- Booking history will be loaded here by JavaScript -->
                    <p class="loading-message">Loading your booking history...</p>
                </div>
                
                <div class="pagination" id="pagination">
                    <!-- Pagination will be added by JavaScript if needed -->
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