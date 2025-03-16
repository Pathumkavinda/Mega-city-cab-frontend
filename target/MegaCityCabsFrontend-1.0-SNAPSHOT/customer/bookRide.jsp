<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book a Ride - MegaCity Cabs</title>
    <link rel="stylesheet" href="../css/bookRide.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script defer src="../js/customer.js"></script>
    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
</head>
<body>
    <header>
        <div class="logo">
            <h1>MEGA CITY CAB</h1>
        </div>
        <nav>
            <ul>
                <li><a href="customerDash.jsp">Home</a></li>
                <li><a href="bookRide.jsp" class="active">Book a Ride</a></li>
                <li><a href="bookingHistory.jsp">My Bookings</a></li>
                <li><a href="customerProfile.jsp">Profile</a></li>
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
        <!-- Step 1: Category Selection -->
        <section id="categorySelection" class="booking-step">
            <h2>Select a Vehicle Category</h2>
            <div id="categoryCards" class="category-container">
                <!-- Categories will be loaded dynamically by JavaScript -->
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading vehicle categories...</p>
                </div>
            </div>
        </section>

        <!-- Step 2: Booking Options -->
        <section id="bookingOptions" class="booking-step" style="display: none;">
            <h2>Choose Your Booking Plan</h2>

            <div class="booking-type-selection">
                <div id="perDayCard" class="booking-card" onclick="toggleBookingType('perDay')">
                    <i class="fas fa-calendar-day fa-2x" style="color: #3a86ff; margin-bottom: 1rem;"></i>
                    <h3>Per Day Rental</h3>
                    <p>Great for longer trips with daily pricing</p>
                </div>

                <div id="distanceCard" class="booking-card" onclick="toggleBookingType('distance')">
                    <i class="fas fa-route fa-2x" style="color: #3a86ff; margin-bottom: 1rem;"></i>
                    <h3>Distance Package</h3>
                    <p>Pay by the distance traveled, not by time</p>
                </div>
            </div>

            <form id="bookingForm">
                <!-- Per Day Options -->
                <div id="perDayOptions" class="booking-option" style="display: none;">
                    <div class="info-box">
                        <p>Per Day Price: <span id="perDayPrice">$0.00</span></p>
                        <p>Max Km Per Day: <span id="perDayKm">0</span> km</p>
                    </div>

                    <!-- Per Day Booking Date Selection -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="startDate">Start Date:</label>
                            <input type="date" id="startDate" required>
                        </div>

                        <div class="form-group">
                            <label for="endDate">End Date:</label>
                            <input type="date" id="endDate" required>
                        </div>
                    </div>
                </div>

                <!-- Distance Package Selection -->
                <div id="distancePackageOptions" class="distance-package-container" style="display: none;">
                    <div class="distance-package-card" id="distance-50" onclick="selectDistancePackage(50)">
                        <i class="fas fa-map-marker-alt" style="color: #3a86ff; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <h3>50 Km Package</h3>
                        <p>Price: <span id="distancePrice50">$0.00</span></p>
                        <p class="discount">20% off standard rate</p>
                    </div>

                    <div class="distance-package-card" id="distance-100" onclick="selectDistancePackage(100)">
                        <i class="fas fa-map-marker-alt" style="color: #3a86ff; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <h3>100 Km Package</h3>
                        <p>Price: <span id="distancePrice100">$0.00</span></p>
                        <p class="discount">10% off standard rate</p>
                    </div>
                </div>

                <!-- Booking Date for Distance Packages -->
                <div id="distanceDateSelection" class="form-row" style="display: none;">
                    <div class="form-group">
                        <label for="distanceStartDate">Booking Date:</label>
                        <input type="date" id="distanceStartDate" required>
                    </div>
                </div>

                <!-- Common Booking Form Fields -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="pickupLocation">Pickup Location:</label>
                        <input type="text" id="pickupLocation" required placeholder="Enter pickup address">
                    </div>

                    <div class="form-group">
                        <label for="destination">Destination:</label>
                        <input type="text" id="destination" required placeholder="Enter destination address">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pickupTime">Pickup Time:</label>
                        <input type="time" id="pickupTime" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="back-btn" onclick="goBack()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="button" class="primary-btn" onclick="showBookingSummary()">
                        Review Booking <i class="fas fa-check"></i>
                    </button>
                </div>
            </form>
        </section>
        
        <!-- Booking Summary Modal -->
        <div id="summaryModal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close-btn" onclick="closeSummaryModal()">&times;</span>
                <h2>Booking Summary</h2>
                <div id="summaryDetails" class="summary-details"></div>

                <div class="terms-agreement">
                    <label>
                        <input type="checkbox" id="agreeTerms" onchange="toggleConfirmButton(this.checked)">
                        I agree to the <a href="#" onclick="showTerms()">terms and conditions</a>
                    </label>
                </div>
                <div class="modal-actions">
                    <button onclick="closeSummaryModal()" class="secondary-btn">Cancel</button>
                    <button id="confirmBookingBtn" class="primary-btn" disabled onclick="confirmBooking()">Confirm & Pay</button>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 MegaCity Cabs. All rights reserved.</p>
    </footer>

    <script>
        // Mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    nav.classList.toggle('active');
                    
                    // Animate the hamburger icon
                    const spans = menuToggle.querySelectorAll('span');
                    spans.forEach(span => span.classList.toggle('active'));
                    
                    // First span rotates to form the top of the X
                    if (spans[0].classList.contains('active')) {
                        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else {
                        spans[0].style.transform = 'none';
                    }
                    
                    // Middle span disappears
                    if (spans[1].classList.contains('active')) {
                        spans[1].style.opacity = '0';
                    } else {
                        spans[1].style.opacity = '1';
                    }
                    
                    // Last span rotates to form the bottom of the X
                    if (spans[2].classList.contains('active')) {
                        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                    } else {
                        spans[2].style.transform = 'none';
                    }
                });
            }
        });
    </script>
</body>
</html>