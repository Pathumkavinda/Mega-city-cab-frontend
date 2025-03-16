<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Manager - MegaCity Cabs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link rel="stylesheet" href="../css/admin-dashboard.css">
        <link rel="stylesheet" href="../css/userManager.css">
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
                <a href="userManager.jsp" class="menu-item active">
                    <i class="fas fa-users"></i> Users
                </a>
                <a href="driverManager.jsp" class="menu-item">
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
                <h1 class="page-title">Manage Users</h1>
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

            <!-- Users List Section -->
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Users List</h2>
                    <div class="section-actions">
                        <div class="filter-options">
                            <select id="filterRole" onchange="filterUsers()">
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="driver">Driver</option>
                            </select>

                        </div>
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="searchInput" placeholder="Search by name, email, NIC, phone..." onkeyup="filterUsers()">
                        </div>
                        <button class="btn btn-primary" id="exportBtn">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="usersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>NIC</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="userTableBody">
                            <tr class="loading-row">
                                <td colspan="9" class="loading-indicator">
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

        <!-- Update User Role Modal -->
<div class="modal" id="updateUserModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Update User Role</h3>
            <button class="close-modal" onclick="closeUpdateModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="updateUserForm">
                <div class="user-profile-header">
                    <div class="user-info-large">
                        <h4 id="updateUserName"></h4>
                        <p id="updateUserEmail"></p>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="updateUserId">User ID</label>
                    <input type="text" id="updateUserId" readonly>
                </div>
                
                <div class="form-group">
                    <label for="updateUserRole">Role</label>
                    <select id="updateUserRole">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal" onclick="closeUpdateModal()">Cancel</button>
            <button class="btn btn-primary" onclick="updateUserRole(event)">Update User</button>
        </div>
    </div>
</div>


        <!-- View User Details Modal -->
        <div class="modal" id="viewUserModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>User Details</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="user-profile-header">
                        <div class="user-avatar-large" id="viewUserInitials">JD</div>
                        <div class="user-info-large">
                            <h4 id="viewUserName">John Doe</h4>
                            <p id="viewUserEmail">john.doe@example.com</p>
                        </div>
                    </div>

                    <div class="user-details-grid">
                        <div class="detail-row">
                            <div class="detail-label">User ID</div>
                            <div class="detail-value" id="viewUserId">1001</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Role</div>
                            <div class="detail-value" id="viewUserRole">
                                <span class="role-badge admin">Admin</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">NIC</div>
                            <div class="detail-value" id="viewUserNic">986532147V</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value" id="viewUserPhone">+94 77 123 4567</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Joined</div>
                            <div class="detail-value" id="viewUserJoined">March 10, 2025</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Status</div>
                            <div class="detail-value" id="viewUserStatus">
                                <span class="status-badge active">Active</span>
                            </div>
                        </div>
                    </div>

                    <div class="user-stats">
                        <div class="stat-card">
                            <div class="stat-icon bookings">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="stat-details">
                                <div class="stat-value" id="viewUserBookings">24</div>
                                <div class="stat-label">Bookings</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon rides">
                                <i class="fas fa-route"></i>
                            </div>
                            <div class="stat-details">
                                <div class="stat-value" id="viewUserRides">18</div>
                                <div class="stat-label">Completed Rides</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon spent">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                            <div class="stat-details">
                                <div class="stat-value" id="viewUserSpent">₹15,240</div>
                                <div class="stat-label">Total Spent</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal">Close</button>
                    <button class="btn btn-primary" id="editUserBtn">
                        <i class="fas fa-edit"></i> Edit User
                    </button>
                </div>
            </div>
        </div>
    </body>
</html>