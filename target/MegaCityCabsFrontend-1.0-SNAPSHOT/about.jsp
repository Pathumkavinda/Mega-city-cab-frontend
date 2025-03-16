<%-- 
    Document   : about
    Created on : Mar 13, 2025, 5:07:42 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - MegacityCabs</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/about.css">
</head>
<body>
    
    
    <main class="about-container">
        <section class="about-hero">
            <h1>About MegacityCabs</h1>
            <p class="tagline">Your Trusted Transportation Partner in the City</p>
        </section>
        
        <section class="about-content">
            <div class="about-story">
                <h2>Our Story</h2>
                <p>Founded in 2015, MegacityCabs started with a simple mission: to provide safe, reliable, and affordable transportation solutions to the bustling metropolis. What began as a small fleet of 10 cars has now grown into the city's most trusted cab service with over 500 vehicles and 1000+ drivers.</p>
                <p>Our journey has been defined by our commitment to innovation, customer satisfaction, and community development. We continually invest in technology, driver training, and vehicle maintenance to ensure the highest standards of service.</p>
            </div>
            
            <div class="about-mission">
                <h2>Our Mission</h2>
                <p>At MegacityCabs, we aim to revolutionize urban transportation by providing efficient, eco-friendly, and customer-centric services that make every journey comfortable, safe, and memorable.</p>
            </div>
            
            <div class="about-values">
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Safety First:</strong> The well-being of our passengers and drivers is our top priority.</li>
                    <li><strong>Reliability:</strong> We pride ourselves on punctuality and dependability.</li>
                    <li><strong>Transparency:</strong> Clear communication and honest pricing are our commitments.</li>
                    <li><strong>Sustainability:</strong> We're actively transitioning to electric vehicles to reduce our carbon footprint.</li>
                    <li><strong>Community:</strong> We believe in giving back to the communities we serve.</li>
                </ul>
            </div>
            
            <div class="about-team">
                <h2>Our Leadership Team</h2>
                <div class="team-grid">
                    <div class="team-member">
                        <div class="member-photo" id="ceo-photo"></div>
                        <h3>John Smith</h3>
                        <p>CEO & Founder</p>
                    </div>
                    <div class="team-member">
                        <div class="member-photo" id="coo-photo"></div>
                        <h3>Sarah Johnson</h3>
                        <p>Chief Operations Officer</p>
                    </div>
                    <div class="team-member">
                        <div class="member-photo" id="cto-photo"></div>
                        <h3>Michael Chen</h3>
                        <p>Chief Technology Officer</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <jsp:include page="footer.jsp" />
    
    <script src="js/common.js"></script>
    <script src="js/about.js"></script>
</body>
</html>
