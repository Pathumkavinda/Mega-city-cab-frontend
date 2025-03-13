<%-- 
    Document   : index
    Created on : Mar 12, 2025, 12:35:00 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGA CITY CAB</title>
        <link rel="stylesheet" href="css/index.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        <header>
            <div class="logo">
                <h1>MEGA CITY CAB</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.jsp" class="active">Home</a></li>
                    <li><a href="about.jsp">About</a></li>
                    <li><a href="help.jsp">Help</a></li>
                    <li><a href="contactus.jsp">Contact</a></li>
                    <li><a href="login.jsp" class="login-btn">Login</a></li>
                </ul>
            </nav>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        
        <main>
            <section class="hero">
                <div class="hero-content">
                    <h2>Welcome to MEGA CITY CAB</h2>
                    <p>Your trusted transportation partner in Colombo.</p>
                    <div class="cta-buttons">
                        <a href="login.jsp" class="cta-button">Login</a>
                        <a href="register.jsp" class="cta-button secondary">Register</a>
                    </div>
                </div>
            </section>
            
               <section class="features">
        <div class="features-grid">
            <div class="feature-card">
                <i class="fas fa-taxi feature-icon"></i>
                <h3>Quick Booking</h3>
                <p>Book your ride in seconds with our streamlined booking system</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-route feature-icon"></i>
                <h3>Track Your Ride</h3>
                <p>Real-time tracking of your journey</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-star feature-icon"></i>
                <h3>Top Rated Drivers</h3>
                <p>Professional and experienced drivers at your service</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-clock feature-icon"></i>
                <h3>24/7 Service</h3>
                <p>Available round the clock for your convenience</p>
            </div>
        </div>
    </section>
        </main>
        
        <footer>
            <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
        </footer>
        
        <script src="js/index.js"></script>
    </body>
</html>