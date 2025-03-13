/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/**
 * JavaScript for the Contact Us page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (!name || !email || !message) {
                showFormMessage('Please fill out all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            showFormMessage('Sending your message...', 'info');
            
            // AJAX request would go here in a real implementation
            // For this example, we'll simulate a successful submission after a delay
            setTimeout(function() {
                showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Function to display form messages
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        
        if (type === 'error') {
            formMessage.classList.add('error');
        } else if (type === 'success') {
            formMessage.classList.add('success');
        } else if (type === 'info') {
            formMessage.classList.add('info');
        }
        
        // Scroll to the message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Initialize Google Map (this would require the Google Maps API)
    function initMap() {
        const mapContainer = document.getElementById('map');
        
        if (mapContainer) {
            // This is a placeholder. In a real implementation, you would use the Google Maps API
            // For now, let's just show a message
            mapContainer.innerHTML = '<div style="padding: 20px; text-align: center; background-color: #f1f1f1;">Map would be displayed here using Google Maps API</div>';
            
            // The actual implementation would look something like this:
            /*
            const map = new google.maps.Map(mapContainer, {
                center: { lat: 37.7749, lng: -122.4194 }, // Example coordinates
                zoom: 15
            });
            
            const marker = new google.maps.Marker({
                position: { lat: 37.7749, lng: -122.4194 },
                map: map,
                title: 'MegacityCabs Headquarters'
            });
            */
        }
    }
    
    // Call the initMap function
    initMap();
});