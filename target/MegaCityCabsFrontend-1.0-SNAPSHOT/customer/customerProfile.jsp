<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - MegaCity Cabs</title>
    <link rel="stylesheet" href="../css/customerProfile.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script defer src="../js/customer.js"></script>
    <link rel="icon" type="image/x-icon" href="../images/favicon.svg">
</head>
<body>
    <header>
        <div class="logo">
            <h1>MegaCity Cabs</h1>
        </div>
        <nav>
            <ul>
                <li><a href="customerDash.jsp">Home</a></li>
                <li><a href="bookRide.jsp">Book a Ride</a></li>
                <li><a href="bookingHistory.jsp">My Bookings</a></li>
                <li><a href="customerProfile.jsp" class="active">Profile</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </nav>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>

    <main>
        <div class="profile-container">
            <!-- Personal Information Section -->
            <section class="profile-section">
                <h2><i class="fas fa-user-circle"></i> My Profile</h2>
                <form id="updateProfileForm">
                    <!-- Personal Information (Read-Only) -->
                    <div>
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" disabled>
                    </div>
                    
                    <div>
                        <label for="username">Username</label>
                        <input type="text" id="username" disabled>
                    </div>
                    
                    <div>
                        <label for="uRole">Account Type</label>
                        <input type="text" id="uRole" disabled>
                    </div>
                    
                    <div>
                        <label for="nic">NIC</label>
                        <input type="text" id="nic" disabled>
                    </div>
                    
                    <!-- Editable Contact Information -->
                    <div>
                        <label for="email">Email Address</label>
                        <input type="email" id="email" required placeholder="Enter your email address">
                    </div>
                    
                    <div>
                        <label for="phone">Phone Number</label>
                        <input type="text" id="phone" required placeholder="Enter your phone number">
                    </div>
                    
                    <div class="full-width">
                        <label for="address">Address</label>
                        <input type="text" id="address" required placeholder="Enter your address">
                    </div>
                    
                    <button type="submit" class="update-btn full-width">
                        <i class="fas fa-save"></i> Update Profile
                    </button>
                </form>
            </section>
            
            <!-- Change Password Section -->
            <section class="profile-section">
                <h2><i class="fas fa-lock"></i> Change Password</h2>
                <form id="changePasswordForm">
                    <div class="full-width">
                        <label for="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" required placeholder="Enter your current password">
                    </div>
                    
                    <div>
                        <label for="newPassword">New Password</label>
                        <input type="password" id="newPassword" required placeholder="Enter your new password">
                    </div>
                    
                    <div>
                        <label for="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" required placeholder="Confirm your new password">
                    </div>
                    
                    <button type="submit" class="update-btn full-width">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                </form>
            </section>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 MegaCity Cabs. All rights reserved.</p>
    </footer>

    <script>
        // Mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    nav.classList.toggle('active');
                    
                    // Animate the hamburger icon
                    const spans = menuToggle.querySelectorAll('span');
                    spans.forEach(span => span.classList.toggle('active'));
                    
                    // First span rotates to form the top of the X
                    if (spans[0].classList.contains('active')) {
                        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else {
                        spans[0].style.transform = 'none';
                    }
                    
                    // Middle span disappears
                    if (spans[1].classList.contains('active')) {
                        spans[1].style.opacity = '0';
                    } else {
                        spans[1].style.opacity = '1';
                    }
                    
                    // Last span rotates to form the bottom of the X
                    if (spans[2].classList.contains('active')) {
                        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                    } else {
                        spans[2].style.transform = 'none';
                    }
                });
            }
        });
    </script>
</body>
</html>