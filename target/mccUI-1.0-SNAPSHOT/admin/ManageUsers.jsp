<%-- 
    Document   : ManageUsers
    Created on : Mar 9, 2025
    Author     : Mega City Cab Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega City Cab - Manage Users</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin-dashboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manage-users.css">
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
            <a href="${pageContext.request.contextPath}/admin/ManageUsers.jsp" class="menu-item active">
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
            <h1 class="page-title">Manage Users</h1>
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
        
        <!-- User Form Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title" id="formTitle">Add New User</h2>
            </div>
            
            <form id="userForm" class="user-form">
                <input type="hidden" id="userId" name="id" value="0">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="uEmail">Email</label>
                        <input type="email" id="uEmail" name="uEmail" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="nic_number">NIC Number</label>
                        <input type="text" id="nic_number" name="nic_number" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="uRole">Role</label>
                        <select id="uRole" name="uRole" required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="driver">Driver</option>
                        </select>
                    </div>
                
                <div class="form-group full-width">
                    <label for="address">Address</label>
                    <textarea id="address" name="address" rows="2" required></textarea>
                </div>
                
                <div class="form-row" id="passwordFields">
                    <div class="form-group">
                        <label for="pWord">Password</label>
                        <input type="password" id="pWord" name="pWord" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="saveBtn">
                        <i class="fas fa-save"></i> Save User
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Users List Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Users List</h2>
                <div class="section-actions">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchUsers" placeholder="Search users...">
                    </div>
                    <button class="btn btn-primary" id="addNewBtn">
                        <i class="fas fa-plus"></i> Add New User
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- User data will be loaded dynamically via JavaScript -->
                        <tr class="loading-row">
                            <td colspan="7" class="loading-indicator">
                                <i class="fas fa-spinner fa-spin"></i> Loading users...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" id="usersPagination">
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
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <p><strong>User:</strong> <span id="deleteUserName"></span></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
    <script src="${pageContext.request.contextPath}/js/admin-dashboard.js"></script>
    <script src="${pageContext.request.contextPath}/js/manage-users.js"></script>
</body>
</html>