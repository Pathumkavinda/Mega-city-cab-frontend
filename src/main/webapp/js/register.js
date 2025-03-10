/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous messages
            errorMessage.textContent = '';
            errorMessage.classList.remove('show');
            successMessage.textContent = '';
            successMessage.classList.remove('show');
            
            // Get form values
            const username = document.getElementById('username').value;
            const fullName = document.getElementById('fullName').value;
            const uEmail = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const nic_number = document.getElementById('nic_number').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            // Validate form
            if (!username || !fullName || !uEmail || !password || !confirmPassword || !nic_number || !phone || !address) {
                showError('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }
            
            // Prepare data for API
            const userData = {
                username: username,
                fullName: fullName,
                uEmail: uEmail,
                pWord: password,
                uRole: 'user', // Default role for new users
                nic_number: nic_number,
                phone: phone,
                address: address
            };
            
            // Call the register API
            fetch('http://localhost:8080/mccAPI/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed. Please try again.');
                }
                return response.json();
            })
            .then(data => {
                showSuccess('Registration successful! You can now login.');
                // Clear the form
                registerForm.reset();
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.jsp';
                }, 2000);
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
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
    }
});

