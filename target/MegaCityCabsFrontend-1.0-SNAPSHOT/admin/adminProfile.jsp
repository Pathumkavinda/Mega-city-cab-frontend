<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Profile - MegaCity Cabs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/admin-dashboard.css">
    <link rel="stylesheet" href="../css/adminProfile.css">
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
            <a href="categoryManager.jsp" class="menu-item">
                <i class="fas fa-tags"></i> Categories
            </a>
            <a href="bookingManager.jsp" class="menu-item">
                <i class="fas fa-calendar-check"></i> Bookings
            </a>
            
            <div class="menu-category">Settings</div>
            <a href="adminProfile.jsp" class="menu-item active">
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
            <h1 class="page-title">My Profile</h1>
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
        
        <div class="profile-container">
            <!-- Profile Overview Card -->
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <div class="avatar-placeholder" id="profileInitials">A</div>
                        <div class="avatar-edit">
                            <i class="fas fa-camera"></i>
                        </div>
                    </div>
                    <div class="profile-info">
                        <h2 id="profileFullName">Admin Name</h2>
                        <p id="profileRole">Administrator</p>
                        <div class="account-status">
                            <span class="status-badge active">Active</span>
                            <span class="last-login">Last login: Today, 09:45 AM</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Profile Sections Container -->
            <div class="profile-sections">
                <!-- Personal Information Section -->
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-user"></i> Personal Information</h2>
                    </div>
                    
                    <form id="updateProfileForm" class="profile-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fullName">Full Name</label>
                                <input type="text" id="fullName" disabled>
                            </div>
                            
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" disabled>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="uRole">Account Type</label>
                                <input type="text" id="uRole" disabled>
                            </div>
                            
                            <div class="form-group">
                                <label for="nic">NIC</label>
                                <input type="text" id="nic" disabled>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" required placeholder="Enter your email address">
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="text" id="phone" required placeholder="Enter your phone number">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="address">Address</label>
                                <input type="text" id="address" required placeholder="Enter your address">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Update Profile
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Change Password Section -->
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-lock"></i> Change Password</h2>
                    </div>
                    
                    <form id="changePasswordForm" class="profile-form">
                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="currentPassword">Current Password</label>
                                <div class="password-field">
                                    <input type="password" id="currentPassword" required placeholder="Enter your current password">
                                    <button type="button" class="toggle-password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <div class="password-field">
                                    <input type="password" id="newPassword" required placeholder="Enter your new password">
                                    <button type="button" class="toggle-password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <div class="password-strength">
                                    <div class="strength-meter">
                                        <div class="strength-bar" style="width: 60%;"></div>
                                    </div>
                                    <span class="strength-text">Medium</span>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <div class="password-field">
                                    <input type="password" id="confirmPassword" required placeholder="Confirm your new password">
                                    <button type="button" class="toggle-password">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-key"></i> Change Password
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Two-Factor Authentication Section -->
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-shield-alt"></i> Security Settings</h2>
                    </div>
                    
                    <div class="security-options">
                        <div class="security-option">
                            <div class="option-details">
                                <h3>Two-Factor Authentication</h3>
                                <p>Add an extra layer of security to your account by enabling two-factor authentication.</p>
                            </div>
                            <div class="option-action">
                                <label class="switch">
                                    <input type="checkbox" id="twoFactorToggle">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="security-option">
                            <div class="option-details">
                                <h3>Login Notifications</h3>
                                <p>Receive email notifications when there's a login to your account from a new device.</p>
                            </div>
                            <div class="option-action">
                                <label class="switch">
                                    <input type="checkbox" id="loginNotificationToggle" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="security-option">
                            <div class="option-details">
                                <h3>Session Management</h3>
                                <p>Manage and control active sessions on different devices.</p>
                            </div>
                            <div class="option-action">
                                <button class="btn btn-secondary">
                                    <i class="fas fa-desktop"></i> Manage Sessions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Password Visibility Toggle Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toggleButtons = document.querySelectorAll('.toggle-password');
            
            toggleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const input = this.previousElementSibling;
                    const icon = this.querySelector('i');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });
        });
    </script>
</body>
</html>