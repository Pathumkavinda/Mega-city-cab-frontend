/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
/**
 * JavaScript for the Forgot Password page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Step management
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    // Form references
    const verifyEmailForm = document.getElementById('verifyEmailForm');
    const verifyCodeForm = document.getElementById('verifyCodeForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resendCodeBtn = document.getElementById('resendCode');
    
    // Password strength elements
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');
    
    // Code input fields
    const codeInputs = document.querySelectorAll('.code-input');
    
    // Show the specified step and hide others
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        currentStep = stepIndex;
    }
    
    // Handle email verification form submission
    if (verifyEmailForm) {
        verifyEmailForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Simple email validation
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate sending verification code
            // In a real implementation, this would make an AJAX request to the server
            setTimeout(function() {
                showStep(1); // Move to step 2 (verification code)
            }, 1000);
        });
    }
    
    // Handle verification code form submission
    if (verifyCodeForm) {
        verifyCodeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get the verification code from input fields
            let code = '';
            codeInputs.forEach(input => {
                code += input.value;
            });
            
            // Validate code length
            if (code.length !== 6) {
                alert('Please enter the 6-digit verification code.');
                return;
            }
            
            // Simulate verifying code
            // In a real implementation, this would make an AJAX request to the server
            setTimeout(function() {
                showStep(2); // Move to step 3 (reset password)
            }, 1000);
        });
    }
    
    // Handle resend code button
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Disable the button temporarily
            resendCodeBtn.textContent = 'Sending...';
            resendCodeBtn.style.pointerEvents = 'none';
            
            // Simulate resending code
            setTimeout(function() {
                resendCodeBtn.textContent = 'Resend code';
                resendCodeBtn.style.pointerEvents = 'auto';
                alert('A new verification code has been sent to your email.');
            }, 2000);
        });
    }
    
    // Handle reset password form submission
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Validate password strength
            if (getPasswordStrength(newPassword) < 2) {
                alert('Your password is too weak. Please choose a stronger password.');
                return;
            }
            
            // Validate password match
            if (newPassword !== confirmPassword) {
                alert('Passwords don\'t match. Please try again.');
                return;
            }
            
            // Simulate password reset
            // In a real implementation, this would make an AJAX request to the server
            setTimeout(function() {
                showStep(3); // Move to step 4 (success)
            }, 1000);
        });
    }
    
    // Handle code input auto-tab
    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function(event) {
                const value = event.target.value;
                
                // Move to the next input if a digit is entered
                if (value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(event) {
                // Go back to the previous input on backspace if current is empty
                if (event.key === 'Backspace' && input.value === '' && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
    
    // Password strength evaluation
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = newPasswordInput.value;
            const strength = getPasswordStrength(password);
            
            updatePasswordStrengthIndicator(strength);
        });
    }
    
    // Function to update the password strength indicator
    function updatePasswordStrengthIndicator(strength) {
        // Update the strength meter
        strengthMeter.style.width = `${(strength / 4) * 100}%`;
        
        // Update color based on strength
        if (strength === 0) {
            strengthMeter.style.backgroundColor = '#ddd';
            strengthText.textContent = 'Password strength';
        } else if (strength === 1) {
            strengthMeter.style.backgroundColor = '#ff4d4d'; // Weak (Red)
            strengthText.textContent = 'Weak';
        } else if (strength === 2) {
            strengthMeter.style.backgroundColor = '#ffaa00'; // Medium (Orange)
            strengthText.textContent = 'Medium';
        } else if (strength === 3) {
            strengthMeter.style.backgroundColor = '#ffff00'; // Strong (Yellow)
            strengthText.textContent = 'Strong';
        } else {
            strengthMeter.style.backgroundColor = '#00cc00'; // Very Strong (Green)
            strengthText.textContent = 'Very Strong';
        }
    }
    
    // Function to evaluate password strength (returns a value from 0 to 4)
    function getPasswordStrength(password) {
        if (!password) return 0;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Contains lowercase and uppercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        // Contains numbers
        if (/\d/.test(password)) strength += 1;
        
        // Contains special characters
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        return strength;
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize the page to show step 1
    showStep(0);
});

