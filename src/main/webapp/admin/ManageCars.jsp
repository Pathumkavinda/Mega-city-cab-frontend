<%-- 
    Document   : ManageCars
    Created on : Mar 8, 2025, 2:29:55 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Cars</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-cars.css">
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
            <a href="${pageContext.request.contextPath}/admin/ManageDrivers.jsp" class="menu-item">
                <i class="fas fa-id-card"></i> Drivers
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageCars.jsp" class="menu-item active">
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
            <h1 class="page-title">Manage Cars</h1>
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
        
        <!-- Car Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New Car</h2>
            </div>
            
            <form id="carForm" class="car-form">
                <input type="hidden" id="carId" name="id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="categoryId">Category</label>
                        <select id="categoryId" name="category_id" required>
                            <option value="">Select Category</option>
                            <!-- Categories will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="numberPlate">Number Plate</label>
                        <input type="text" id="numberPlate" name="number_plate" required placeholder="e.g., ABC-1234">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="chassisNumber">Chassis Number</label>
                        <input type="text" id="chassisNumber" name="chassis_number" required placeholder="e.g., ECO123456789">
                    </div>
                    
                    <div class="form-group">
                        <label for="isActive">Status</label>
                        <select id="isActive" name="is_active" required>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">
                        <i class="fas fa-save"></i> Save Car
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Cars List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Cars List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterStatus" onchange="filterCars()">
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <select id="filterCategory" onchange="filterCars()">
                            <option value="all">All Categories</option>
                            <!-- Categories will be loaded dynamically -->
                        </select>
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchCars" placeholder="Search cars..." onkeyup="filterCars()">
                    </div>
                    <button class="btn btn-primary" id="addNewBtn">
                        <i class="fas fa-plus"></i> Add New Car
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="carsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Number Plate</th>
                            <th>Category</th>
                            <th>Chassis Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Car data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="6" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading cars...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" id="carsPagination">
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
                <p>Are you sure you want to delete this car? This action cannot be undone.</p>
                <p><strong>Car:</strong> <span id="deleteCarPlate"></span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
    

    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-cars.js"></script>
</body>
</html>
