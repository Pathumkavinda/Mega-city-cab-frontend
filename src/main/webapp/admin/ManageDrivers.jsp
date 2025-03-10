<%-- 
    Document   : ManageDrivers
    Created on : Mar 8, 2025, 2:34:12 PM
    Author     : Admin
--%>


<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Drivers</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-drivers.css">
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
            <a href="${pageContext.request.contextPath}/admin/adminDash.jsp" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Overview
            </a>
            
            <div class="menu-category">Management</div>
            <a href="${pageContext.request.contextPath}/admin/ManageUsers.jsp" class="menu-item">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageDrivers.jsp" class="menu-item active">
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
            <a href="${pageContext.request.contextPath}/admin/ManagePackage.jsp" class="menu-item">
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
            <h1 class="page-title">Manage Drivers</h1>
            <div class="user-info">
                <div class="user-avatar" id="userInitials">A</div>
                <div class="user-name" id="adminName">Admin</div>
                <div class="logout-btn" id="headerLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </div>
        
        <!-- Flash Message (if any) -->
        <div id="flashMessage" class="alert" style="display:none;">
            <div id="flashMessageText"></div>
            <button class="alert-close" onclick="closeAlert(this)">&times;</button>
        </div>
        
        <!-- Driver Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New Driver</h2>
            </div>
            
            <form id="driverForm" class="driver-form">
                <input type="hidden" id="driverId" name="id" value="0">
                
                <!-- User Selection or Display -->
                <div class="form-group full-width user-selection-group">
                    <label for="userId">User</label>
                    <div class="user-select-container">
                        <select id="userId" name="user_id" required>
                            <option value="">Select User</option>
                            <!-- User options will be loaded dynamically -->
                        </select>
                        <button type="button" class="btn btn-secondary" id="refreshUsersBtn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div class="selected-user-info" id="selectedUserInfo" style="display:none;">
                        <div class="user-info-field">
                            <span class="field-label">Name:</span>
                            <span class="field-value" id="userFullName"></span>
                        </div>
                        <div class="user-info-field">
                            <span class="field-label">Email:</span>
                            <span class="field-value" id="userEmail"></span>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="licenseNumber">License Number</label>
                        <input type="text" id="licenseNumber" name="license_number" required placeholder="e.g., DL12345678">
                        <span class="help-text">Format: Two letters followed by at least 8 digits</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="licenseExpiry">License Expiry Date</label>
                        <input type="date" id="licenseExpiry" name="license_expiry" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="experienceYears">Years of Experience</label>
                        <input type="number" id="experienceYears" name="experience_years" min="0" max="50" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="rating">Initial Rating</label>
                        <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" value="3.0">
                    </div>
                    
                    <div class="form-group">
                        <label for="isAvailable">Availability Status</label>
                        <select id="isAvailable" name="is_available" required>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">
                        <i class="fas fa-save"></i> Save Driver
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Drivers List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Drivers List</h2>
                <div class="section-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchDrivers" placeholder="Search drivers...">
                    </div>
                    <div class="filter-options">
                        <select id="filterAvailability" onchange="filterDrivers()">
                            <option value="all">All Status</option>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="addNewBtn">
                        <i class="fas fa-plus"></i> Add New Driver
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="driversTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Driver Name</th>
                            <th>License No.</th>
                            <th>Expiry</th>
                            <th>Car</th>
                            <th>Experience</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Driver data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="9" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading drivers...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" id="driversPagination">
                <!-- Pagination will be generated dynamically -->
            </div>
        </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div class="modal" id="deleteModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Deletion</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this driver? This action cannot be undone.</p>
                <p><strong>Driver:</strong> <span id="deleteDriverName"></span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

    <!-- Assign Car Modal -->
    <div class="modal" id="assignCarModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Assign Car to Driver</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Select a car to assign to <strong><span id="assignDriverName"></span></strong>:</p>
                <div class="form-group">
                    <label for="carSelect">Available Cars</label>
                    <select id="carSelect" class="full-width">
                        <option value="">Select a car</option>
                        <!-- Cars will be loaded dynamically -->
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="confirmAssignBtn">Assign Car</button>
            </div>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/driver-user-integration.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-drivers.js"></script>
</body>
</html>