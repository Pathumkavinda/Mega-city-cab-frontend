<%-- 
    Document   : contactus
    Created on : Mar 13, 2025, 5:10:36 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - MegacityCabs</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/contact.css">
</head>
<body>
    <jsp:include page="header.jsp" />
    
    <main class="contact-container">
        <section class="contact-hero">
            <h1>Contact Us</h1>
            <p class="tagline">We're Here to Help You</p>
        </section>
        
        <section class="contact-content">
            <div class="contact-info">
                <div class="contact-card">
                    <div class="icon"><i class="fas fa-map-marker-alt"></i></div>
                    <h3>Visit Us</h3>
                    <p>MegacityCabs Headquarters</p>
                    <p>123 Transport Avenue</p>
                    <p>Megacity, MC 10001</p>
                </div>
                
                <div class="contact-card">
                    <div class="icon"><i class="fas fa-phone"></i></div>
                    <h3>Call Us</h3>
                    <p>Customer Service: +1 (555) 123-4567</p>
                    <p>Booking Hotline: +1 (555) 765-4321</p>
                    <p>Corporate Inquiries: +1 (555) 987-6543</p>
                </div>
                
                <div class="contact-card">
                    <div class="icon"><i class="fas fa-envelope"></i></div>
                    <h3>Email Us</h3>
                    <p>General Inquiries: info@megacitycabs.com</p>
                    <p>Support: support@megacitycabs.com</p>
                    <p>Press: media@megacitycabs.com</p>
                </div>
                
                <div class="contact-card">
                    <div class="icon"><i class="fas fa-clock"></i></div>
                    <h3>Hours of Operation</h3>
                    <p>Cab Service: 24/7</p>
                    <p>Customer Support: Mon-Fri, 8am-10pm</p>
                    <p>Office Hours: Mon-Fri, 9am-6pm</p>
                </div>
            </div>
            
            <div class="contact-form-container">
                <h2>Send Us a Message</h2>
                <form id="contactForm" class="contact-form">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Your Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <select id="subject" name="subject">
                            <option value="general">General Inquiry</option>
                            <option value="support">Customer Support</option>
                            <option value="feedback">Feedback</option>
                            <option value="business">Business Partnership</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Your Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-btn">Send Message</button>
                </form>
                <div id="formMessage" class="form-message"></div>
            </div>
            
            <div class="contact-map">
                <h2>Find Us on the Map</h2>
                <div id="map" class="map-container">
                    <!-- Map will be loaded here via JavaScript -->
                </div>
            </div>
        </section>
    </main>
    
    <jsp:include page="footer.jsp" />
    
    <script src="js/common.js"></script>
    <script src="js/contact.js"></script>
</body>
</html>