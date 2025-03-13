/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate the hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            // First span rotates to form the top of the X
            if (spans[0].classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            } else {
                spans[0].style.transform = 'none';
            }
            
            // Middle span disappears
            if (spans[1].classList.contains('active')) {
                spans[1].style.opacity = '0';
            } else {
                spans[1].style.opacity = '1';
            }
            
            // Last span rotates to form the bottom of the X
            if (spans[2].classList.contains('active')) {
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Check if user is logged in
    function checkUserSession() {
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('userRole');
        
        if (userId && userRole) {
            // If user is logged in, modify navigation
            const loginButton = document.querySelector('.login-btn');
            if (loginButton) {
                loginButton.textContent = 'Dashboard';
                loginButton.href = userRole === 'admin' ? 'admin/dashboard.jsp' : 'dashboard.jsp';
            }
            
            // Add logout button to navigation
            const navUl = document.querySelector('nav ul');
            if (navUl) {
                const logoutLi = document.createElement('li');
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'logout-btn';
                logoutLink.textContent = 'Logout';
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Clear session storage
                    sessionStorage.removeItem('userId');
                    sessionStorage.removeItem('userRole');
                    // Redirect to home page
                    window.location.href = 'index.jsp';
                });
                logoutLi.appendChild(logoutLink);
                navUl.appendChild(logoutLi);
            }
        }
    }

    // Call the function to check user session on page load
    checkUserSession();
});
