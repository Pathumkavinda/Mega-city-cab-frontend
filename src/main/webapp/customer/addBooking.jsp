<%-- 
    Document   : addBooking
    Created on : Mar 13, 2025, 4:33:41 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Book a Ride - MEGA CITY CAB</title>
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
                    <li><a href="customerDash.jsp">Dashboard</a></li>
                    <li><a href="addBooking.jsp" class="active">Book a Ride</a></li>
                    <li><a href="bookingHistory.jsp">Booking History</a></li>
                    <li><a href="logout.jsp" id="logout-btn">Logout</a></li>
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
                <div class="page-title">
                    <h2>Book a Ride</h2>
                    <p>Fill in the details below to book your cab</p>
                </div>
                
                <div id="error-message" class="message-container error"></div>
                <div id="success-message" class="message-container success"></div>
                
                <div class="booking-form-wrapper">
                    <form id="booking-form" class="booking-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pickup-location">Pickup Location <span class="required">*</span></label>
                                <div class="input-with-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <input type="text" id="pickup-location" name="pickup-location" placeholder="Enter your pickup location" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="destination">Destination <span class="required">*</span></label>
                                <div class="input-with-icon">
                                    <i class="fas fa-flag-checkered"></i>
                                    <input type="text" id="destination" name="destination" placeholder="Enter your destination" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pickup-date">Pickup Date <span class="required">*</span></label>
                                <div class="input-with-icon">
                                    <i class="fas fa-calendar-alt"></i>
                                    <input type="date" id="pickup-date" name="pickup-date" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="pickup-time">Pickup Time <span class="required">*</span></label>
                                <div class="input-with-icon">
                                    <i class="fas fa-clock"></i>
                                    <input type="time" id="pickup-time" name="pickup-time" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="vehicle-type">Package Type <span class="required">*</span></label>
                                <div class="select-with-icon">
                                    <i class="fas fa-car"></i>
                                    <select id="vehicle-type" name="vehicle-type" required>
                                        <option value="">Select a package</option>
                                        <!-- Packages will be loaded from API -->
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="passengers">Number of Passengers</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-users"></i>
                                    <input type="number" id="passengers" name="passengers" min="1" max="10" value="1">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="notes">Special Instructions (Optional)</label>
                            <textarea id="notes" name="notes" rows="3" placeholder="Any special requests or instructions for the driver"></textarea>
                        </div>
                        
                        <div id="fare-estimate" class="fare-estimate">
                            <h3>Fare Estimate</h3>
                            <p>Fill in your trip details above to get a fare estimate</p>
                        </div>
                        
                        <div class="form-buttons">
                            <button type="reset" class="btn-secondary">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                            <button type="submit" class="btn-primary submit-btn">
                                <i class="fas fa-check-circle"></i> Book Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
        </footer>
        
        <script src="${pageContext.request.contextPath}/js/index.js"></script>
        <script src="${pageContext.request.contextPath}/js/customer.js"></script>
        <script src="${pageContext.request.contextPath}/js/booking.js"></script>
    </body>
</html>
