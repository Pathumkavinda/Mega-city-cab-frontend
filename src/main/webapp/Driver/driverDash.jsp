<%-- 
    Document   : DriverDashboard
    Created on : Mar 10, 2025, 12:12:31 PM
    Author     : Admin
--%>

<%-- 
    Document   : driverDashboard
    Created on : Mar 10, 2025
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Driver Dashboard - MEGA CITY CAB</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Font Awesome for icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <!-- Dashboard specific styles -->
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/driver-dashboard.css">
    </head>
    <body>
        <!-- Sidebar Navigation -->
        <div class="d-flex" id="wrapper">
            <!-- Sidebar -->
            <div class="bg-dark text-white" id="sidebar-wrapper">
                <div class="sidebar-heading p-3 border-bottom">
                    <h3>MEGA CITY CAB</h3>
                    <p class="text-light mb-0">Driver Portal</p>
                </div>
                <div class="list-group list-group-flush">
                    <a href="${pageContext.request.contextPath}/driver/driverDashboard.jsp" class="list-group-item list-group-item-action active">
                        <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                    </a>
                    <a href="${pageContext.request.contextPath}/driver/myTrips.jsp" class="list-group-item list-group-item-action">
                        <i class="fas fa-route me-2"></i> My Trips
                    </a>
                    <a href="${pageContext.request.contextPath}/driver/earnings.jsp" class="list-group-item list-group-item-action">
                        <i class="fas fa-wallet me-2"></i> Earnings
                    </a>
                    <a href="${pageContext.request.contextPath}/driver/vehicle.jsp" class="list-group-item list-group-item-action">
                        <i class="fas fa-car me-2"></i> My Vehicle
                    </a>
                    <a href="${pageContext.request.contextPath}/driver/profile.jsp" class="list-group-item list-group-item-action">
                        <i class="fas fa-user-circle me-2"></i> Profile
                    </a>
                    <a href="#" id="logoutBtn" class="list-group-item list-group-item-action mt-auto">
                        <i class="fas fa-sign-out-alt me-2"></i> Logout
                    </a>
                </div>
            </div>
            
            <!-- Page Content -->
            <div id="page-content-wrapper">
                <!-- Top Navigation -->
                <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                    <div class="container-fluid">
                        <button class="btn btn-primary" id="sidebarToggle">
                            <i class="fas fa-bars"></i>
                        </button>
                        <div class="ms-auto d-flex">
                            <div class="dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="me-2" id="driverName">Driver Name</span>
                                    <div class="avatar-circle">
                                        <span class="initials" id="driverInitials">DN</span>
                                    </div>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><a class="dropdown-item" href="${pageContext.request.contextPath}/driver/profile.jsp">
                                        <i class="fas fa-user-circle me-2"></i> Profile
                                    </a></li>
                                    <li><a class="dropdown-item" href="${pageContext.request.contextPath}/driver/settings.jsp">
                                        <i class="fas fa-cog me-2"></i> Settings
                                    </a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#" id="headerLogoutBtn">
                                        <i class="fas fa-sign-out-alt me-2"></i> Logout
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <!-- Main Content -->
                <div class="container-fluid p-4">
                    <h1 class="mb-4">Driver Dashboard</h1>
                    
                    <!-- Status Card -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h5 class="card-title">Current Status</h5>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="availabilityToggle" checked>
                                        <label class="form-check-label" for="availabilityToggle">
                                            <span id="statusText" class="status-available">Available</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="d-flex justify-content-end">
                                        <div class="card-value">
                                            <span id="tripCount">0</span>
                                            <span class="card-label">Today's Trips</span>
                                        </div>
                                        <div class="card-value ms-4">
                                            <span id="earningsToday">$0.00</span>
                                            <span class="card-label">Today's Earnings</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Dashboard Content -->
                    <div class="row">
                        <!-- Statistics Cards -->
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">Weekly Trips</h5>
                                            <div class="card-value-lg">
                                                <span id="weeklyTrips">0</span>
                                            </div>
                                            <div class="progress mt-3">
                                                <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                                            </div>
                                            <small class="text-muted mt-2 d-block">Target: 50 trips</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">Rating</h5>
                                            <div class="card-value-lg">
                                                <span id="driverRating">0.0</span>
                                                <i class="fas fa-star text-warning"></i>
                                            </div>
                                            <div class="rating-breakdown mt-3">
                                                <div class="d-flex justify-content-between">
                                                    <small>5 stars</small>
                                                    <small>0 ratings</small>
                                                </div>
                                                <div class="progress mt-1 mb-2" style="height: 5px;">
                                                    <div class="progress-bar bg-success" role="progressbar" style="width: 0%"></div>
                                                </div>
                                                
                                                <div class="d-flex justify-content-between">
                                                    <small>4 stars</small>
                                                    <small>0 ratings</small>
                                                </div>
                                                <div class="progress mt-1 mb-2" style="height: 5px;">
                                                    <div class="progress-bar bg-info" role="progressbar" style="width: 0%"></div>
                                                </div>
                                                
                                                <div class="d-flex justify-content-between">
                                                    <small>< 4 stars</small>
                                                    <small>0 ratings</small>
                                                </div>
                                                <div class="progress mt-1" style="height: 5px;">
                                                    <div class="progress-bar bg-warning" role="progressbar" style="width: 0%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 mb-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Weekly Earnings</h5>
                                            <div class="placeholder-chart">
                                                <div class="text-center py-5 text-muted">
                                                    <i class="fas fa-chart-bar fa-4x mb-3"></i>
                                                    <p>Chart will load with your earnings data</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity / Upcoming Trips -->
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Upcoming Trips</h5>
                                </div>
                                <div class="list-group list-group-flush" id="upcomingTrips">
                                    <div class="list-group-item">
                                        <div class="d-flex justify-content-center align-items-center py-5">
                                            <div class="text-center text-muted">
                                                <i class="fas fa-calendar fa-3x mb-3"></i>
                                                <p>No upcoming trips scheduled</p>
                                                <small>Your future trips will appear here</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <a href="${pageContext.request.contextPath}/driver/myTrips.jsp" class="btn btn-sm btn-outline-primary w-100">View All Trips</a>
                                </div>
                            </div>
                            
                            <!-- Vehicle Information -->
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">Vehicle Information</h5>
                                </div>
                                <div class="card-body">
                                    <div id="vehicleInfo">
                                        <div class="text-center py-4 text-muted">
                                            <i class="fas fa-car fa-3x mb-3"></i>
                                            <p>No vehicle assigned yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <footer class="bg-light border-top p-3 text-center">
                    <p class="mb-0">&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
                </footer>
            </div>
        </div>

        <!-- Bootstrap JS with Popper -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Driver Dashboard Script -->
        <script src="${pageContext.request.contextPath}/js/driver-dashboard.js"></script>
    </body>
</html>