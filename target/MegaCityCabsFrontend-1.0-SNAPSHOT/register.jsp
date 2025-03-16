<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Mega City Cabs</title>
    <link rel="stylesheet" href="css/register.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script defer src="js/register.js"></script>
    <link rel="icon" type="image/x-icon" href="images/favicon.svg">
</head>
<body>
    <header>
        <div class="logo">
            <h1>MEGA CITY CAB</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.jsp">Home</a></li>
                <li><a href="help.jsp">Help</a></li>
                <li><a href="contact.jsp">Contact Us</a></li>
                <li><a href="login.jsp">Login</a></li>
                <li><a href="register.jsp" class="active">Register</a></li>
            </ul>
        </nav>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>
    
    <main>
        <section class="register-container">
            <h2>Create Your Account</h2>
            <form id="registerForm">
                <div>
                    <label for="username">Username</label>
                    <input type="text" id="username" required placeholder="Choose a username">
                </div>
                
                <div>
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required placeholder="Enter your full name">
                </div>
                
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" required placeholder="Enter your email">
                </div>
                
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" required placeholder="Create a password (min. 6 characters)">
                </div>
                
                <div>
                    <label for="nic">National ID (NIC)</label>
                    <input type="text" id="nic" required placeholder="e.g., 957654321V or 199576543210">
                </div>
                
                <div>
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" placeholder="Enter your phone number">
                </div>
                
                <div>
                    <label for="address">Address</label>
                    <input type="text" id="address" placeholder="Enter your address">
                </div>
                
                <button type="submit">Create Account</button>
                <p id="error-message" class="error"></p>
            </form>
            <p>Already have an account? <a href="login.jsp">Login here</a></p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
    </footer>
    
    <script>
        // Add mobile menu toggle functionality
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