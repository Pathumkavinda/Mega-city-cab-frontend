<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Dashboard - MEGA CITY CAB</title>
    <link rel="stylesheet" href="../css/customerDash.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script defer src="../js/customer.js"></script>

    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
</head>
<body>
    <header>
        <h1>MEGA CITY CAB</h1>
        <nav>
            <ul>
                <li><a href="customerDash.jsp" class="active">Dashboard</a></li>
                <li><a href="bookRide.jsp">Book a Ride</a></li>
                <li><a href="bookingHistory.jsp">Booking History</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
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
            <!-- Welcome Section -->
            <section class="welcome-section">
    <h2>Welcome, <span id="customerName">Customer</span>!</h2>
    <p>Manage your rides and bookings with ease.</p>
</section>
            
            <!-- Stats Section -->
            <section class="stats-section">
                <div class="stat-card">
                    <i class="fas fa-taxi"></i>
                    <h3>Active Bookings</h3>
                    <p id="activeBookingsCount">0</p>
                </div>
                
                <div class="stat-card">
                    <i class="fas fa-history"></i>
                    <h3>Past Rides</h3>
                    <p id="pastRidesCount">0</p>
                </div>
                
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <h3>Average Rating</h3>
                    <p id="averageRating">0.0</p>
                </div>
            </section>
                        <!-- Next Trip Details Section -->
            <section class="trip-details">
                <h2>Your Next Trip</h2>
                <div id="tripInfo" class="trip-container">
                    <div class="loading-message">
                        Loading your upcoming trip details...
                    </div>
                </div>
            </section>
            <!-- Quick Actions Section -->
            <section class="quick-actions">
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    <a href="bookRide.jsp" class="action-btn">
                        <i class="fas fa-plus"></i> New Booking
                    </a>
                    <a href="bookingHistory.jsp" class="action-btn">
                        <i class="fas fa-eye"></i> View History
                    </a>
                    <a href="customerProfile.jsp" class="action-btn">
                        <i class="fas fa-user-edit"></i> Edit Profile
                    </a>
                </div>
            </section>
            
            
            

        </div>
    </main>
    
    <footer>
        <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
    </footer>
    
    <script>

    </script>
</body>
</html>