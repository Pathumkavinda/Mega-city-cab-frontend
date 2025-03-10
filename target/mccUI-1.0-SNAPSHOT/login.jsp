
<%-- 
    Document   : login
    Created on : Mar 8, 2025, 12:31:28 PM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - MEGA CITY CAB</title>
        <link rel="stylesheet" href="css/index.css">
        <link rel="stylesheet" href="css/login.css">
    </head>
    <body>
        <header>
            <div class="logo">
                <h1>MEGA CITY CAB</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.jsp">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="login.jsp" class="login-btn active">Login</a></li>
                </ul>
            </nav>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        
        <main>
            <div class="login-container">
                <h2>Login to Your Account</h2>
                <div id="error-message" class="error-message"></div>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="submit-btn">Login</button>
                    <div class="form-footer">
                        <p>Don't have an account? <a href="register.jsp">Register here</a></p>
                        <p><a href="#">Forgot password?</a></p>
                    </div>
                </form>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
        </footer>
        
        <script src="js/index.js"></script>
        <script src="js/login.js"></script>
    </body>
</html>