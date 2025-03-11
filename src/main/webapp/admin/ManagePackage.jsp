<%-- 
    Document   : ManagePackge
    Created on : Mar 8, 2025, 2:32:55 PM
    Author     : Admin
--%>

<%-- 
    Document   : ManagePackage
    Created on : Mar 10, 2025
    Author     : Mega City Cab Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Packages</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-package.css">
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
            <a href="${pageContext.request.contextPath}/admin/ManageCars.jsp" class="menu-item">
                <i class="fas fa-car"></i> Cars
            </a>
            <a href="${pageContext.request.contextPath}/admin/Category.jsp" class="menu-item">
                <i class="fas fa-tags"></i> Category
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManageBooking.jsp" class="menu-item">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            <a href="${pageContext.request.contextPath}/admin/ManagePackage.jsp" class="menu-item active">
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
            <h1 class="page-title">Manage Packages</h1>
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
        
        <!-- Package Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New Package</h2>
            </div>
            
            <form id="packageForm" class="package-form">
                <input type="hidden" id="packageId" name="package_id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="packageName">Package Name</label>
                        <input type="text" id="packageName" name="package_name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="packageType">Package Type</label>
                        <select id="packageType" name="package_type" required>
                            <option value="">Select Type</option>
                            <option value="Day">Day</option>
                            <option value="Kilometer">Kilometer</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="categoryName">Category</label>
                        <select id="categoryName" name="category_name" required>
                            <option value="">Select Category</option>
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="basePrice">Base Price (Rs.)</label>
                        <input type="number" id="basePrice" name="base_price" min="0" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group" id="includedKilometersGroup">
                        <label for="includedKilometers">Included Kilometers</label>
                        <input type="number" id="includedKilometers" name="included_kilometers" min="0">
                        <span class="info-text">For Day packages</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="perKilometerCharge">Per Kilometer Charge (Rs.)</label>
                        <input type="number" id="perKilometerCharge" name="per_kilometer_charge" min="0" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="waitingCharge">Waiting Charge (Rs.)</label>
                        <input type="number" id="waitingCharge" name="waiting_charge" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="isActive">Status</label>
                        <select id="isActive" name="is_active" required>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">
                        <i class="fas fa-save"></i> Save Package
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Packages List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Packages List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterCategory" onchange="filterPackages()">
                            <option value="all">All Categories</option>
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Van">Van</option>
                        </select>
                        <select id="filterType" onchange="filterPackages()">
                            <option value="all">All Types</option>
                            <option value="Day">Day</option>
                            <option value="Kilometer">Kilometer</option>
                        </select>
                        <select id="filterStatus" onchange="filterPackages()">
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="addNewBtn">
                        <i class="fas fa-plus"></i> Add New Package
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="packagesTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Base Price</th>
                            <th>Included KM</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Package data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="8" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading packages...
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                <p>Are you sure you want to delete this package? This action cannot be undone.</p>
                <p><strong>Package:</strong> <span id="deletePackageName"></span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-package.js"></script>
</body>
</html>
