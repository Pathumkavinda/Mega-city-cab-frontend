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
});

// Function to handle the "Book Now" button click
function bookNow() {
    window.location.href = "booking.jsp"; // Redirect to booking page
}

// Check if user is logged in (future implementation)
function checkUserSession() {
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');
    
    if (userId && userRole) {
        // If user is logged in, modify navigation
        const loginButton = document.querySelector('a[href="login.jsp"]');
        if (loginButton) {
            loginButton.textContent = 'Dashboard';
            loginButton.href = userRole === 'admin' ? 'admin/dashboard.jsp' : 'dashboard.jsp';
        }
        
        // Add logout functionality (if needed)
    }
}