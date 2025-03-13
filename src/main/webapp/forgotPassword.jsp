<%-- 
    Document   : forgotPassword
    Created on : Mar 13, 2025, 5:12:05 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - MegacityCabs</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/auth1.css">
</head>
<body>
    <jsp:include page="header.jsp" />
    
    <main class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1>Forgot Password</h1>
                <p>We'll help you reset your password</p>
            </div>
            
            <div class="auth-steps">
                <div class="step active" id="step1">
                    <h2>Step 1: Verify Your Email</h2>
                    <form id="verifyEmailForm">
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <button type="submit" class="auth-btn">Send Verification Code</button>
                    </form>
                </div>
                
                <div class="step" id="step2">
                    <h2>Step 2: Enter Verification Code</h2>
                    <form id="verifyCodeForm">
                        <div class="form-group">
                            <label for="code">Verification Code</label>
                            <div class="code-inputs">
                                <input type="text" maxlength="1" class="code-input" required>
                                <input type="text" maxlength="1" class="code-input" required>
                                <input type="text" maxlength="1" class="code-input" required>
                                <input type="text" maxlength="1" class="code-input" required>
                                <input type="text" maxlength="1" class="code-input" required>
                                <input type="text" maxlength="1" class="code-input" required>
                            </div>
                        </div>
                        <p class="resend-code">Didn't receive a code? <a href="#" id="resendCode">Resend code</a></p>
                        <button type="submit" class="auth-btn">Verify Code</button>
                    </form>
                </div>
                
                <div class="step" id="step3">
                    <h2>Step 3: Create New Password</h2>
                    <form id="resetPasswordForm">
                        <div class="form-group">
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" required>
                            <div class="password-strength">
                                <div class="strength-meter" id="strengthMeter"></div>
                                <p class="strength-text" id="strengthText">Password strength</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm New Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                        <button type="submit" class="auth-btn">Reset Password</button>
                    </form>
                </div>
                
                <div class="step" id="step4">
                    <div class="success-message">
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h2>Password Reset Successfully!</h2>
                        <p>Your password has been updated. You can now log in with your new password.</p>
                        <a href="login.jsp" class="auth-btn">Go to Login</a>
                    </div>
                </div>
            </div>
            
            <div class="auth-footer">
                <p>Remember your password? <a href="login.jsp">Log in</a></p>
            </div>
        </div>
    </main>
    
    <jsp:include page="footer.jsp" />
    
    <script src="js/common.js"></script>
    <script src="js/forgotPassword.js"></script>
</body>
</html>
