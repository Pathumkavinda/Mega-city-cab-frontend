<%-- 
    Document   : help
    Created on : Mar 13, 2025, 5:13:37 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help Center - MegacityCabs</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/help.css">
</head>
<body>
   
    
    <main class="help-container">
        <section class="help-hero">
            <h1>Help Center</h1>
            <p class="tagline">Find answers to your questions</p>
            <div class="help-search">
                <input type="text" id="helpSearch" placeholder="Search for help topics...">
                <button id="searchBtn"><i class="fas fa-search"></i></button>
            </div>
        </section>
        
        <section class="help-content">
            <div class="help-topics">
                <h2>Browse by Topic</h2>
                <div class="topics-grid">
                    <div class="topic-card" data-topic="account">
                        <div class="topic-icon"><i class="fas fa-user-circle"></i></div>
                        <h3>Account & Profile</h3>
                    </div>
                    <div class="topic-card" data-topic="booking">
                        <div class="topic-icon"><i class="fas fa-taxi"></i></div>
                        <h3>Booking & Rides</h3>
                    </div>
                    <div class="topic-card" data-topic="payment">
                        <div class="topic-icon"><i class="fas fa-credit-card"></i></div>
                        <h3>Payment & Billing</h3>
                    </div>
                    <div class="topic-card" data-topic="drivers">
                        <div class="topic-icon"><i class="fas fa-id-card"></i></div>
                        <h3>Drivers & Vehicles</h3>
                    </div>
                    <div class="topic-card" data-topic="safety">
                        <div class="topic-icon"><i class="fas fa-shield-alt"></i></div>
                        <h3>Safety & Security</h3>
                    </div>
                    <div class="topic-card" data-topic="technical">
                        <div class="topic-icon"><i class="fas fa-laptop-code"></i></div>
                        <h3>Technical Issues</h3>
                    </div>
                </div>
            </div>
            
            <div class="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div class="faq-filter">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="account">Account</button>
                    <button class="filter-btn" data-filter="booking">Booking</button>
                    <button class="filter-btn" data-filter="payment">Payment</button>
                    <button class="filter-btn" data-filter="other">Other</button>
                </div>
                
                <div class="faq-list">
                    <div class="faq-item" data-category="account">
                        <div class="faq-question">
                            <h3>How do I create an account?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>To create an account, click on the "Register" button on the top right corner of our website. Fill in your personal details, create a password, and verify your email address to complete the registration process.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="account">
                        <div class="faq-question">
                            <h3>How can I update my profile information?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>Log in to your account, navigate to your profile settings by clicking on your name in the top right corner, then select "Edit Profile". From there, you can update your personal information, contact details, and preferences.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="booking">
                        <div class="faq-question">
                            <h3>How do I book a cab?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>To book a cab, log in to your account, go to the "Add Booking" page, enter your pickup and drop-off locations, select the date and time, choose a vehicle type, and confirm your booking. You'll receive a confirmation email with your booking details.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="booking">
                        <div class="faq-question">
                            <h3>How can I cancel my booking?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>To cancel a booking, go to "Booking History" in your customer dashboard, find the booking you want to cancel, and click on the "Cancel" button. Please note that cancellation fees may apply depending on how close to the pickup time you cancel.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="payment">
                        <div class="faq-question">
                            <h3>What payment methods are accepted?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), digital wallets (PayPal, Apple Pay, Google Pay), and cash payments to the driver. You can select your preferred payment method during the booking process.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="payment">
                        <div class="faq-question">
                            <h3>How do I get a receipt for my ride?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>Receipts are automatically sent to your email address after the completion of your ride. You can also find all your ride receipts in the "Booking History" section of your customer dashboard.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item" data-category="other">
                        <div class="faq-question">
                            <h3>What if I left an item in the cab?</h3>
                            <div class="toggle-icon"><i class="fas fa-plus"></i></div>
                        </div>
                        <div class="faq-answer">
                            <p>If you've left an item in the cab, please contact our customer support immediately at +1 (555) 123-4567 or report the lost item through your account under "Booking History." Provide details of your ride and the lost item. We'll work with the driver to help locate and return your belongings.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="help-contact">
                <h2>Still Need Help?</h2>
                <p>Our customer support team is available to assist you with any questions or concerns.</p>
                <div class="contact-options">
                    <a href="contactus.jsp" class="contact-btn"><i class="fas fa-envelope"></i> Contact Us</a>
                    <a href="tel:+15551234567" class="contact-btn"><i class="fas fa-phone"></i> Call Support</a>
                    <button id="liveChatBtn" class="contact-btn"><i class="fas fa-comment-dots"></i> Live Chat</button>
                </div>
            </div>
            
            <div class="help-guides">
                <h2>User Guides</h2>
                <div class="guides-grid">
                    <div class="guide-card">
                        <div class="guide-icon"><i class="fas fa-book"></i></div>
                        <h3>Customer User Guide</h3>
                        <p>Learn how to make the most of your MegacityCabs customer account.</p>
                        <a href="#" class="guide-link">View Guide</a>
                    </div>
                    <div class="guide-card">
                        <div class="guide-icon"><i class="fas fa-car"></i></div>
                        <h3>Driver User Guide</h3>
                        <p>Get started with the MegacityCabs driver platform.</p>
                        <a href="#" class="guide-link">View Guide</a>
                    </div>
                    <div class="guide-card">
                        <div class="guide-icon"><i class="fas fa-mobile-alt"></i></div>
                        <h3>Mobile App Guide</h3>
                        <p>Step-by-step instructions for using our mobile application.</p>
                        <a href="#" class="guide-link">View Guide</a>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <jsp:include page="footer.jsp" />
    
    <script src="js/common.js"></script>
    <script src="js/help.js"></script>
</body>
</html>