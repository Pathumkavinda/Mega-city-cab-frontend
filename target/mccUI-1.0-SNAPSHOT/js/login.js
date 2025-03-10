/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Clear previous error messages
            errorMessage.textContent = '';
            errorMessage.classList.remove('show');
            
            // Validate form
            if (!email || !password) {
                showError('Please fill in all fields.');
                return;
            }
            
            // Prepare data for API
            const userData = {
                uEmail: email,
                pWord: password
            };
            
            // Call the login API
            fetch('http://localhost:8080/mccAPI/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Invalid email or password.');
                    }
                    throw new Error('Login failed. Please try again.');
                }
                return response.json();
            })
            .then(data => {
                // Store user data in session storage
                sessionStorage.setItem('userId', data.userId);
                sessionStorage.setItem('userRole', data.uRole);
                
                // Redirect based on user role
                if (data.uRole === 'admin') {
                    window.location.href = 'admin/adminDash.jsp';
                } else if(data.uRole === 'user') {
                    window.location.href = 'customer/customerDashboard.jsp';
                }else if (data.uRole === 'driver'){
                    window.location.href = 'Driver/DriverDashboard.jsp';
                }else {
                    alert("Invalid User");
                }
            })
            .catch(error => {
                showError(error.message);
            });
        });
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }
});
