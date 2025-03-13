/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * JavaScript for the About page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animation for team member photos on scroll
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to add animation class when element is in viewport
    function animateOnScroll() {
        teamMembers.forEach(member => {
            if (isInViewport(member) && !member.classList.contains('animate')) {
                member.classList.add('animate');
            }
        });
    }
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Check on initial load
    animateOnScroll();
});
