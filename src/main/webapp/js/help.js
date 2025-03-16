/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/**
 * JavaScript for the Help Center page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('helpSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchHelpTopics(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchHelpTopics(searchInput.value);
            }
        });
    }
    
    // Function to handle help search
    function searchHelpTopics(query) {
        if (!query.trim()) {
            alert('Please enter a search term.');
            return;
        }
        
        // In a real implementation, this would search through help topics
        // For this demo, let's just show an alert
        alert(`Searching for: "${query}"\n\nIn a real implementation, this would display matching help topics.`);
        
        // Reset the search input
        searchInput.value = '';
    }
    
    // Topic cards navigation
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        card.addEventListener('click', function() {
            const topic = card.getAttribute('data-topic');
            
            // In a real implementation, this would navigate to topic-specific content
            // For this demo, let's just show an alert
            alert(`You selected the "${topic}" topic.\n\nIn a real implementation, this would navigate to ${topic}-specific help content.`);
        });
    });
    
    // FAQ filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter FAQ items
            faqItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = question.parentElement;
            
            // Toggle the active class
            faqItem.classList.toggle('active');
            
            // Update the icon
            const icon = question.querySelector('.toggle-icon i');
            if (faqItem.classList.contains('active')) {
                icon.className = 'fas fa-minus';
            } else {
                icon.className = 'fas fa-plus';
            }
        });
    });
    
    // Live chat button
    const liveChatBtn = document.getElementById('liveChatBtn');
    
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            // In a real implementation, this would open a live chat widget
            // For this demo, let's just show an alert
            alert('Live chat would open here in a real implementation.');
        });
    }
});
