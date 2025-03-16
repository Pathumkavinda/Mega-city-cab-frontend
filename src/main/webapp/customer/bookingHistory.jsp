<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Booking History - MEGA CITY CAB</title>
    <link rel="stylesheet" href="../css/bookingHistory.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script defer src="../js/customer.js"></script>
    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
</head>
<body>
    <header>
        <div class="logo">
            <h1>MEGA CITY CAB</h1>
        </div>
        <nav>
            <ul>
                <li><a href="customerDash.jsp">Home</a></li>
                <li><a href="bookRide.jsp">Book a Ride</a></li>
                <li><a href="bookingHistory.jsp" class="active">My Bookings</a></li>
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
        <section class="booking-history">
            <h2>Your Ride History</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Pickup</th>
                            <th>Destination</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Time</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="bookingTableBody">
                        <!-- Booking data will be loaded here via JavaScript -->
                        <tr>
                            <td colspan="11">
                                <div class="loading-message">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Loading your booking history...</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- Rating Modal -->
    <div id="ratingModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeRatingModal()">&times;</span>
            <h2>Rate Your Trip</h2>
            <form id="ratingForm">
                <input type="hidden" id="ratingBookingId">
                
                <label for="tripRating">Rating:</label>
                <select id="tripRating" required>
                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (Very Good)</option>
                    <option value="3">⭐⭐⭐ (Good)</option>
                    <option value="2">⭐⭐ (Fair)</option>
                    <option value="1">⭐ (Poor)</option>
                </select>
                
                <label for="tripComment">Your Feedback:</label>
                <textarea id="tripComment" placeholder="Please share your experience..." required></textarea>
                
                <button type="button" onclick="submitRating()">Submit Rating</button>
            </form>
        </div>
    </div>

    <footer>
        <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
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
            
            // Fix for modal display
            // This ensures the modal displays properly when opened with JavaScript
            const ratingModal = document.getElementById('ratingModal');
            if (ratingModal) {
                ratingModal.addEventListener('show', function() {
                    this.style.display = 'flex';
                });
            }
        });
    </script>
</body>
</html>