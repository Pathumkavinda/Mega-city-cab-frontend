<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - MegaCity Cabs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/admin-dashboard.css">
    <link rel="stylesheet" href="../css/adminDash.css">
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
            <a href="adminDash.jsp" class="menu-item active">
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
            <h1 class="page-title">Dashboard</h1>
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
        
        <!-- Stats Overview -->
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3 id="totalUsers">0</h3>
                    <p>Total Users</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon drivers">
                    <i class="fas fa-id-card"></i>
                </div>
                <div class="stat-info">
                    <h3 id="totalDrivers">0</h3>
                    <p>Active Drivers</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon vehicles">
                    <i class="fas fa-car"></i>
                </div>
                <div class="stat-info">
                    <h3 id="totalVehicles">0</h3>
                    <p>Total Vehicles</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon bookings">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h3 id="activeBookings">0</h3>
                    <p>Active Bookings</p>
                </div>
            </div>
        </div>
        
        <!-- Quick Actions Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Quick Actions</h2>
            </div>
            
            <div class="quick-actions-grid">
                <a href="userManager.jsp" class="quick-action-card">
                    <div class="action-icon users">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="action-details">
                        <h3>User Manager</h3>
                        <p>Manage all system users, roles, and permissions.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
                
                <a href="driverManager.jsp" class="quick-action-card">
                    <div class="action-icon drivers">
                        <i class="fas fa-id-card"></i>
                    </div>
                    <div class="action-details">
                        <h3>Driver Manager</h3>
                        <p>Manage drivers, licenses, and vehicle assignments.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
                
                <a href="vehicleManager.jsp" class="quick-action-card">
                    <div class="action-icon vehicles">
                        <i class="fas fa-car"></i>
                    </div>
                    <div class="action-details">
                        <h3>Vehicle Manager</h3>
                        <p>Manage all vehicles, maintenance, and availability.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
                
                <a href="categoryManager.jsp" class="quick-action-card">
                    <div class="action-icon categories">
                        <i class="fas fa-tags"></i>
                    </div>
                    <div class="action-details">
                        <h3>Category Manager</h3>
                        <p>Manage vehicle categories, pricing, and features.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
                
                <a href="bookingManager.jsp" class="quick-action-card">
                    <div class="action-icon bookings">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="action-details">
                        <h3>Booking Manager</h3>
                        <p>Manage customer bookings, status, and assignments.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
                
                <a href="adminProfile.jsp" class="quick-action-card">
                    <div class="action-icon settings">
                        <i class="fas fa-cogs"></i>
                    </div>
                    <div class="action-details">
                        <h3>Profile Settings</h3>
                        <p>Manage application settings and configurations.</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </a>
            </div>
        </div>
        
        <!-- Recent Activity Section -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Recent Activities</h2>
                <a href="#" class="view-all-link">View All <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="activity-list" id="recentActivities">
                <!-- Activity items will be loaded dynamically -->
                <div class="activity-item">
                    <div class="activity-icon bookings">
                        <i class="fas fa-calendar-plus"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">New booking created by <strong>John Doe</strong></div>
                        <div class="activity-time">5 minutes ago</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon drivers">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">New driver <strong>Mark Johnson</strong> registered</div>
                        <div class="activity-time">1 hour ago</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon vehicles">
                        <i class="fas fa-car"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">Vehicle <strong>KA-01-AB-1234</strong> status updated to Active</div>
                        <div class="activity-time">3 hours ago</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon users">
                        <i class="fas fa-user-edit"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">User <strong>Sarah Williams</strong> profile updated</div>
                        <div class="activity-time">Yesterday</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon bookings">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">Booking <strong>#10045</strong> completed successfully</div>
                        <div class="activity-time">Yesterday</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>