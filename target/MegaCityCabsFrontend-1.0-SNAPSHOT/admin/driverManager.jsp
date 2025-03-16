<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Manager - MegaCity Cabs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/admin-dashboard.css">
    <link rel="stylesheet" href="../css/driverManager.css">
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
            <a href="driverManager.jsp" class="menu-item active">
                <i class="fas fa-id-card"></i> Drivers
            </a>
            <a href="vehicleManager.jsp" class="menu-item">
                <i class="fas fa-car"></i> Vehicles
            </a>
            <a href="categoryManager.jsp" class="menu-item">
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
            <h1 class="page-title">Manage Drivers</h1>
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
        
        <!-- Driver Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New Driver</h2>
            </div>
            
            <form id="driverForm" class="driver-form">
                <input type="hidden" id="driverId" name="id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="userId">Select User</label>
                        <select id="userId" name="user_id" required>
                            <option value="">Select User</option>
                            <!-- Users will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="dlNumber">Driver License Number</label>
                        <input type="text" id="dlNumber" name="license_number" required placeholder="e.g., DL12345678">
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
                        <i class="fas fa-save"></i> Save Driver
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
                <p id="error-message" class="error-message"></p>
            </form>
        </div>
        
        <!-- Drivers List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Drivers List</h2>
                <div class="section-actions">
                    <div class="filter-options">
                        <select id="filterStatus" onchange="filterDrivers()">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search drivers..." onkeyup="filterDrivers()">
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
                            <th>User</th>
                            <th>License Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="driverTableBody">
                        <!-- Driver data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="5" class="loading-indicator">
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
    
    <!-- Assign Vehicle Modal -->
    <div class="modal" id="assignVehicleModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Assign Vehicle</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Assign a vehicle to <strong><span id="assignDriverName"></span></strong></p>
                <div class="form-group">
                    <label for="vehicleId">Select Vehicle</label>
                    <select id="vehicleId" name="vehicle_id" required>
                        <option value="">Select Vehicle</option>
                        <!-- Vehicles will be loaded dynamically -->
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="confirmAssignBtn">Assign</button>
            </div>
        </div>
    </div>
    <!-- Update Driver Status Modal -->
<div class="modal" id="updateDriverModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Update Driver Status</h3>
            <button class="close-modal" onclick="closeUpdateStatusModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Driver:</strong> <span id="updateDriverName"></span></p>
            <p><strong>License Number:</strong> <span id="updateDriverDL"></span></p>
            
            <div class="form-group">
                <label for="updateDriverStatus">Status</label>
                <select id="updateDriverStatus">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal" onclick="closeUpdateStatusModal()">Cancel</button>
            <button class="btn btn-primary" id="confirmUpdateStatusBtn" onclick="updateDriverStatus(event)">
                <i class="fas fa-save"></i> Update Status
            </button>
        </div>
    </div>
</div>
<!-- Update Driver Status Modal -->
<div class="modal" id="updateDriverModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Update Driver Status</h3>
            <button class="close-modal" onclick="closeUpdateStatusModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Driver:</strong> <span id="updateDriverName"></span></p>
            <p><strong>License Number:</strong> <span id="updateDriverDL"></span></p>
            <input type="hidden" id="updateDriverId">

            <div class="form-group">
                <label for="updateDriverStatus">Status</label>
                <select id="updateDriverStatus">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal" onclick="closeUpdateStatusModal()">Cancel</button>
            <button class="btn btn-primary" id="confirmUpdateStatusBtn">Update</button>
        </div>
    </div>
</div>
</body>
</html>