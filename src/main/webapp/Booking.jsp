<%-- 
    Document   : Booking
    Created on : Mar 10, 2025
    Author     : Mega City Cab
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book a Cab - MEGA CITY CAB</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/booking.css">
</head>
<body>
    <header>
        <div class="logo">
            <h1>MEGA CITY CAB</h1>
        </div>
        <nav>
            <ul>
                <li><a href="${pageContext.request.contextPath}/index.jsp">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="${pageContext.request.contextPath}/customer/customerDashboard.jsp" class="login-btn">My Account</a></li>
            </ul>
        </nav>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>
    
    <main>
        <div class="booking-container">
            <h2>Book Your Ride</h2>
            
            <!-- Booking Progress -->
            <div class="booking-progress">
                <div class="progress-step active" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-label">Location</div>
                </div>
                <div class="progress-step" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-label">Package</div>
                </div>
                <div class="progress-step" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-label">Car</div>
                </div>
                <div class="progress-step" data-step="4">
                    <div class="step-number">4</div>
                    <div class="step-label">Confirm</div>
                </div>
            </div>
            
            <form id="bookingForm">
                <!-- Step 1: Location Details -->
                <div class="booking-step active" id="step1">
                    <h3>Location Details</h3>
                    
                    <div class="form-group full-width">
                        <label for="pickupLocation">Pickup Location</label>
                        <input type="text" id="pickupLocation" name="pickupLocation" placeholder="Enter pickup address" required>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="destination">Destination</label>
                        <input type="text" id="destination" name="destination" placeholder="Enter destination address" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pickupDate">Pickup Date</label>
                            <input type="date" id="pickupDate" name="pickupDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="pickupTime">Pickup Time</label>
                            <input type="time" id="pickupTime" name="pickupTime" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="passengers">Number of Passengers</label>
                            <input type="number" id="passengers" name="passengers" min="1" max="8" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="notes">Additional Notes</label>
                            <textarea id="notes" name="notes" placeholder="Any special requirements or information"></textarea>
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <div></div> <!-- Empty div to maintain flex layout -->
                        <button type="button" class="btn btn-primary btn-next" data-step="1">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Step 2: Package Selection -->
                <div class="booking-step" id="step2">
                    <h3>Select Package</h3>
                    
                    <div class="form-group">
                        <label for="packageTypeFilter">Filter Package Type</label>
                        <select id="packageTypeFilter" name="packageTypeFilter">
                            <option value="all">All Packages</option>
                            <option value="Day">Day Package</option>
                            <option value="Kilometer">Kilometer Package</option>
                        </select>
                    </div>
                    
                    <div class="package-options" id="packageOptions">
                        <!-- Package options will be loaded dynamically -->
                        <div class="loading-indicator">
                            <i class="fas fa-spinner fa-spin"></i> Loading packages...
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary btn-prev">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button type="button" class="btn btn-primary btn-next" data-step="2" disabled>
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Step 3: Car Selection -->
                <div class="booking-step" id="step3">
                    <h3>Select Car</h3>
                    
                    <div class="car-options" id="carOptions">
                        <!-- Car options will be loaded dynamically -->
                        <div class="loading-indicator">
                            <i class="fas fa-spinner fa-spin"></i> Loading cars...
                        </div>
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary btn-prev">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button type="button" class="btn btn-primary btn-next" data-step="3" disabled>
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Step 4: Booking Confirmation -->
                <div class="booking-step" id="step4">
                    <h3>Booking Summary</h3>
                    
                    <div class="booking-summary" id="bookingSummary">
                        <!-- Summary will be populated dynamically -->
                    </div>
                    
                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary btn-prev">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button type="button" id="confirmBookingBtn" class="btn btn-primary">
                            Confirm Booking <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </main>
    
    <footer>
        <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
    </footer>
    
    <script src="${pageContext.request.contextPath}/js/index.js"></script>
    <script src="${pageContext.request.contextPath}/js/booking.js"></script>
</body>
</html>