<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - MEGA CITY CAB</title>
         <link rel="stylesheet" href="css/index.css">
        <link rel="stylesheet" href="css/auth.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        <header>
            <div class="logo">
                <h1>MEGA CITY CAB</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.jsp">Home</a></li>
                    <li><a href="login.jsp" class="active">Login</a></li>
                    <li><a href="register.jsp">Register</a></li>
                </ul>
            </nav>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        
        <main>
            <div class="auth-container">
                <div class="form-container">
                    <h2>Login to Your Account</h2>
                    <p>Enter your credentials to access your account</p>
                    
                    <div id="error-message" class="message-container error"></div>
                    
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <div class="input-with-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="input-with-icon">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <div class="form-group remember-me">
                            <label class="checkbox-container">
                                <input type="checkbox" id="remember-me" name="remember-me">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                        </div>
                        
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                    
                    <div class="additional-options">
                        <button type="button" class="btn-secondary btn-forgot" onclick="window.location.href='forgotPassword.jsp'">
                            <i class="fas fa-key"></i> Forgot Password
                        </button>
                        <button type="button" class="btn-secondary btn-help" onclick="window.location.href='help.jsp'">
                            <i class="fas fa-question-circle"></i> Help
                        </button>
                    </div>
                    
                    <div class="auth-footer">
                        <p>Don't have an account? <a href="register.jsp" class="register-link">Register Now</a></p>
                    </div>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 MEGA CITY CAB. All rights reserved.</p>
        </footer>
        
        <script src="js/index.js"></script>
        <script src="js/login.js"></script>
    </body>
</html>