<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Categories</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-category.css">
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
            <a href="${pageContext.request.contextPath}/admin/Category.jsp" class="menu-item active">
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
            <h1 class="page-title">Manage Categories</h1>
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
        
        <!-- Category Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New Category</h2>
            </div>
            
            <form id="categoryForm" class="category-form">
                <input type="hidden" id="categoryId" name="category_id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="categoryName">Category Name</label>
                        <select id="categoryName" name="category_name" required onchange="updateMaxPassengers()">
                            <option value="">Select Category</option>
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Van">Van</option>
                        </select>
                        <span class="info-text">Select a category to see available cars</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="carId">Car</label>
                        <select id="carId" name="car_id" required>
                            <option value="">Select Car</option>
                            <!-- Car options will be loaded dynamically -->
                        </select>
                        <span class="info-text">Showing only cars matching selected category that are not in any category yet</span>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="maxPassengers">Max Passengers</label>
                        <input type="number" id="maxPassengers" name="max_passengers" min="1" max="8" required>
                        <span id="passengerLimit" class="info-text"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="isAvailable">Availability</label>
                        <select id="isAvailable" name="is_available" required>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pricePerKm">Price Per Kilometer (Rs.)</label>
                        <input type="number" id="pricePerKm" name="price_per_km" min="0.01" step="0.01" required>
                        <span class="info-text pricing-info">Standard rates will apply based on category</span>
                    </div>
                    
                    <div class="form-group">
                        <label for="waitingCharge">Waiting Charge Per Hour (Rs.)</label>
                        <input type="number" id="waitingCharge" name="waiting_charge" min="0.01" step="0.01" required>
                        <span class="info-text pricing-info">Standard rates will apply based on category</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">
                        <i class="fas fa-save"></i> Save Category
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Categories List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Categories List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterAvailability" onchange="filterCategories()">
                            <option value="all">All</option>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                        <select id="filterCategory" onchange="filterCategories()">
                            <option value="all">All Categories</option>
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="addNewBtn">
                        <i class="fas fa-plus"></i> Add New Category
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="categoriesTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Car ID</th>
                            <th>Car Details</th>
                            <th>Max Passengers</th>
                            <th>Price/km</th>
                            <th>Waiting Charge</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Categories data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="9" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading categories...
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
                <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                <p><strong>Category:</strong> <span id="deleteCategoryName"></span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>


    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-category.js"></script>
</body>
</html>