<%-- 
    Document   : customerDashboard
    Created on : Mar 11, 2025
    Author     : Mega City Cab
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dashboard - MEGA CITY CAB</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/customer-dashboard.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="${pageContext.request.contextPath}/index.jsp">
                <i class="fas fa-taxi me-2"></i>MEGA CITY CAB
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="${pageContext.request.contextPath}/index.jsp">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Contact</a>
                    </li>
                </ul>
                <div class="d-flex align-items-center">
                    <div class="dropdown">
                        <a class="btn btn-outline-light dropdown-toggle d-flex align-items-center" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="avatar-circle me-2">
                                <span class="initials" id="userInitials">U</span>
                            </div>
                            <span id="navUsername">User</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="#profile-tab" data-bs-toggle="tab" onclick="switchTab('profile')"><i class="fas fa-user me-2"></i>My Profile</a></li>
                            <li><a class="dropdown-item" href="#bookings-tab" data-bs-toggle="tab" onclick="switchTab('bookings')"><i class="fas fa-taxi me-2"></i>My Bookings</a></li>
                            <li><a class="dropdown-item" href="#payment-tab" data-bs-toggle="tab" onclick="switchTab('payment')"><i class="fas fa-credit-card me-2"></i>Payment Methods</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-4">
        <!-- Welcome Banner -->
        <div class="card mb-4 welcome-banner">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="welcome-text">Welcome, <span id="customerName">User</span>!</h2>
                    <p class="text-muted mb-0">Manage your bookings and account details</p>
                </div>
                <a href="${pageContext.request.contextPath}/Booking.jsp" class="btn btn-primary btn-lg">
                    <i class="fas fa-plus me-2"></i>Book a Ride
                </a>
            </div>
        </div>

        <!-- Dashboard Nav Tabs -->
        <ul class="nav nav-pills nav-fill mb-4" id="dashboardTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="bookings-tab-btn" data-bs-toggle="tab" data-bs-target="#bookings-tab" type="button" role="tab">
                    <i class="fas fa-taxi me-2"></i>My Bookings
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab-btn" data-bs-toggle="tab" data-bs-target="#profile-tab" type="button" role="tab">
                    <i class="fas fa-user me-2"></i>My Profile
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="payment-tab-btn" data-bs-toggle="tab" data-bs-target="#payment-tab" type="button" role="tab">
                    <i class="fas fa-credit-card me-2"></i>Payment Methods
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content" id="dashboardTabContent">
            <!-- Bookings Tab -->
            <div class="tab-pane fade show active" id="bookings-tab" role="tabpanel">
                <div class="card">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">My Rides</h5>
                        <div class="d-flex">
                            <select class="form-select me-2" id="bookingFilter">
                                <option value="all">All Bookings</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                           
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div id="bookingsList" class="booking-list">
                            <!-- Bookings will be loaded dynamically -->
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="mt-2">Loading your bookings...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Tab -->
            <div class="tab-pane fade" id="profile-tab" role="tabpanel">
                <div class="row">
                    <div class="col-md-8">
                        <div class="card mb-4">
                            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Personal Information</h5>
                                <button class="btn btn-sm btn-outline-primary" id="editProfileBtn">
                                    <i class="fas fa-edit me-2"></i>Edit
                                </button>
                            </div>
                            <div class="card-body">
                                <form id="profileForm">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="fullName" class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="fullName" name="fullName" disabled>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="username" class="form-label">Username</label>
                                            <input type="text" class="form-control" id="username" name="username" disabled>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" disabled>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="phone" class="form-label">Phone</label>
                                            <input type="tel" class="form-control" id="phone" name="phone" disabled>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="nic" class="form-label">NIC Number</label>
                                        <input type="text" class="form-control" id="nic" name="nic_number" disabled>
                                    </div>
                                    <div class="mb-3">
                                        <label for="address" class="form-label">Address</label>
                                        <textarea class="form-control" id="address" name="address" rows="3" disabled></textarea>
                                    </div>
                                    <div id="profileFormActions" style="display: none;">
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                        <button type="button" id="cancelEditBtn" class="btn btn-outline-secondary ms-2">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header bg-white">
                                <h5 class="mb-0">Change Password</h5>
                            </div>
                            <div class="card-body">
                                <form id="passwordForm">
                                    <div class="mb-3">
                                        <label for="currentPassword" class="form-label">Current Password</label>
                                        <input type="password" class="form-control" id="currentPassword" name="currentPassword" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="newPassword" class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="newPassword" name="newPassword" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Update Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Methods Tab -->
            <div class="tab-pane fade" id="payment-tab" role="tabpanel">
                <div class="card">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Payment Methods</h5>
                        <button class="btn btn-primary" id="addPaymentBtn">
                            <i class="fas fa-plus me-2"></i>Add Payment Method
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="paymentMethodsList">
                            <!-- Payment methods will be populated dynamically -->
                            <div class="text-center py-5">
                                <i class="fas fa-credit-card display-1 text-muted mb-3"></i>
                                <h4>No Payment Methods</h4>
                                <p class="text-muted">You don't have any saved payment methods yet.</p>
                                <p class="text-muted">Add a payment method to make booking faster.</p>
                            </div>
                        </div>
                        
                        <!-- Add Payment Method Form (Initially Hidden) -->
                        <div id="paymentForm" class="mt-4 card border-light" style="display: none;">
                            <div class="card-header bg-light">
                                <h5 class="mb-0">Add Payment Method</h5>
                            </div>
                            <div class="card-body">
                                <form id="addPaymentForm">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="cardType" class="form-label">Card Type</label>
                                            <select id="cardType" name="cardType" class="form-select" required>
                                                <option value="">Select Card Type</option>
                                                <option value="visa">Visa</option>
                                                <option value="mastercard">Mastercard</option>
                                                <option value="amex">American Express</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="cardName" class="form-label">Name on Card</label>
                                            <input type="text" id="cardName" name="cardName" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="cardNumber" class="form-label">Card Number</label>
                                        <input type="text" id="cardNumber" name="cardNumber" class="form-control" placeholder="XXXX XXXX XXXX XXXX" required>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="expiryDate" class="form-label">Expiry Date</label>
                                            <input type="text" id="expiryDate" name="expiryDate" class="form-control" placeholder="MM/YY" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="cvv" class="form-label">CVV</label>
                                            <input type="text" id="cvv" name="cvv" class="form-control" placeholder="123" required>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button type="button" id="cancelCardBtn" class="btn btn-outline-secondary me-2">Cancel</button>
                                        <button type="submit" class="btn btn-primary">Save Card</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>MEGA CITY CAB</h5>
                    <p>Your trusted transportation partner in the city</p>
                </div>
                <div class="col-md-3">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light">About Us</a></li>
                        <li><a href="#" class="text-light">Services</a></li>
                        <li><a href="#" class="text-light">Contact</a></li>
                        <li><a href="#" class="text-light">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Connect With Us</h5>
                    <div class="social-icons">
                        <a href="#" class="text-light me-2"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-light me-2"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-light me-2"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            <hr class="my-3">
            <div class="text-center">
                <p class="mb-0">&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Booking Details Modal -->
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="bookingModalLabel">Booking Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="bookingDetails">
                    <!-- Booking details will be populated dynamically -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" id="cancelBookingBtn" style="display: none;">Cancel Booking</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">Confirm Action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="confirmMessage">Are you sure you want to proceed?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" id="confirmActionBtn">Yes, Proceed</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container for Notifications -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
        <div id="toastNotification" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-info-circle me-2"></i>
                <strong class="me-auto" id="toastTitle">Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body" id="toastMessage">
                <!-- Toast message will be set dynamically -->
            </div>
        </div>
    </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="${pageContext.request.contextPath}/js/customer-dashboard.js"></script>
</body>
</html>