<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category Manager - MegaCity Cabs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="stylesheet" href="../css/admin-dashboard.css">
    <link rel="stylesheet" href="../css/categoryManager.css">
    <script defer src="../js/admin.js"></script>
    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
</head>
<body>
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="../images/mega_city_cab_logo.png" alt="MegaCity Cabs Logo">
            <h3>Admin Panel</h3>
        </div>
        
        <nav class="sidebar-menu">
            <div class="menu-category">Dashboard</div>
            <a href="adminDash.jsp" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Overview
            </a>
            
            <div class="menu-category">Management</div>
            <a href="userManager.jsp" class="menu-item">
                <i class="fas fa-users"></i> Users
            </a>
            <a href="driverManager.jsp" class="menu-item">
                <i class="fas fa-id-card"></i> Drivers
            </a>
            <a href="vehicleManager.jsp" class="menu-item">
                <i class="fas fa-car"></i> Vehicles
            </a>
            <a href="categoryManager.jsp" class="menu-item active">
                <i class="fas fa-tags"></i> Categories
            </a>
            <a href="bookingManager.jsp" class="menu-item">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            
            <div class="menu-category">Settings</div>
            <a href="adminProfile.jsp" class="menu-item">
                <i class="fas fa-user-cog"></i> My Profile
            </a>
            <a href="../login.jsp" id="logoutBtn" class="menu-item">
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
                <input type="hidden" id="categoryId" name="id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="catName">Category Name</label>
                        <input type="text" id="catName" name="category_name" required placeholder="e.g., Economy, Premium">
                    </div>
                    
                    <div class="form-group">
                        <label for="maxPassengers">Max Passengers</label>
                        <input type="number" id="maxPassengers" name="max_passengers" required placeholder="e.g., 4">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="perKm">Price per Km (Rs)</label>
                        <input type="number" step="0.01" id="perKm" name="price_per_km" required placeholder="e.g., 15.00">
                    </div>
                    
                    <div class="form-group">
                        <label for="perHr">Price per Hour (Rs)</label>
                        <input type="number" step="0.01" id="perHr" name="price_per_hour" required placeholder="e.g., 150.00">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="perDayPrice">Price per Day (Rs)</label>
                        <input type="number" step="0.01" id="perDayPrice" name="price_per_day" required placeholder="e.g., 2500.00">
                    </div>
                    
                    <div class="form-group">
                        <label for="perDayKm">Km per Day</label>
                        <input type="number" id="perDayKm" name="km_per_day" required placeholder="e.g., 250">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status" required>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
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
                <p id="error-message" class="error-message"></p>
            </form>
        </div>
        
        <!-- Categories List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Categories List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterStatus" onchange="filterCategories()">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search categories..." onkeyup="filterCategories()">
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
                            <th>Category Name</th>
                            <th>Max Passengers</th>
                            <th>Per Km (Rs)</th>
                            <th>Per Hour (Rs)</th>
                            <th>Per Day (Rs)</th>
                            <th>Km per Day</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="categoryTableBody">
                        <!-- Category data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="9" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading categories...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" id="categoriesPagination">
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
                <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                <p><strong>Category:</strong> <span id="deleteCategoryName"></span></p>
                <p class="warning-text"><i class="fas fa-exclamation-triangle"></i> Warning: Deleting a category may affect associated vehicles.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
    
    <!-- Update Category Modal -->
<div class="modal" id="updateCategoryModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Update Category</h3>
            <button class="close-modal" onclick="closeUpdateCategoryModal()">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="updateCategoryId">
            
            <div class="form-group">
                <label for="updateCatName">Category Name</label>
                <input type="text" id="updateCatName" required>
            </div>
            
            <div class="form-group">
                <label for="updateMaxPassengers">Max Passengers</label>
                <input type="number" id="updateMaxPassengers" required>
            </div>

            <div class="form-group">
                <label for="updatePerKm">Price per Km (Rs)</label>
                <input type="number" step="0.01" id="updatePerKm" required>
            </div>

            <div class="form-group">
                <label for="updatePerHr">Price per Hour (Rs)</label>
                <input type="number" step="0.01" id="updatePerHr" required>
            </div>

            <div class="form-group">
                <label for="updatePerDayPrice">Price per Day (Rs)</label>
                <input type="number" step="0.01" id="updatePerDayPrice" required>
            </div>

            <div class="form-group">
                <label for="updatePerDayKm">Km per Day</label>
                <input type="number" id="updatePerDayKm" required>
            </div>

            <div class="form-group">
                <label for="updateCategoryStatus">Status</label>
                <select id="updateCategoryStatus">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeUpdateCategoryModal()">Cancel</button>
            <button class="btn btn-primary" id="confirmUpdateCategoryBtn">
                <i class="fas fa-check"></i> Update Category
            </button>
        </div>
    </div>
</div>

</body>
</html>