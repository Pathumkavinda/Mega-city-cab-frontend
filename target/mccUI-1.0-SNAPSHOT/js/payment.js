/**
 * JavaScript for the Payment page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load booking details from URL parameters or session storage
    loadBookingDetails();
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected tab content
            tabPanes.forEach(pane => {
                if (pane.id === tabName + 'Tab') {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
    
    // Card payment form
    const cardPaymentForm = document.getElementById('cardPaymentForm');
    
    if (cardPaymentForm) {
        // Format card number with spaces
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                let formattedValue = '';
                
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                
                e.target.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
            });
        }
        
        // Format expiry date with slash
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                
                e.target.value = value;
            });
        }
        
        // Limit CVV to 3 or 4 digits
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value.substring(0, 4);
            });
        }
        
        // Form submission
        cardPaymentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate form
            if (!validateCardPaymentForm()) {
                return;
            }
            
            // Process payment
            processPayment('card');
        });
    }
    
    // Wallet payment button
    const walletPayBtn = document.getElementById('walletPayBtn');
    
    if (walletPayBtn) {
        walletPayBtn.addEventListener('click', function() {
            const selectedWallet = document.querySelector('input[name="walletType"]:checked');
            
            if (!selectedWallet) {
                alert('Please select a payment wallet.');
                return;
            }
            
            // Process payment
            processPayment('wallet', selectedWallet.value);
        });
    }
    
    // Cash payment button
    const cashPayBtn = document.getElementById('cashPayBtn');
    const confirmCashCheckbox = document.getElementById('confirmCash');
    
    if (cashPayBtn && confirmCashCheckbox) {
        // Enable/disable cash payment button based on checkbox
        confirmCashCheckbox.addEventListener('change', function() {
            cashPayBtn.disabled = !confirmCashCheckbox.checked;
        });
        
        // Cash payment submission
        cashPayBtn.addEventListener('click', function() {
            if (!confirmCashCheckbox.checked) {
                return;
            }
            
            // Process payment
            processPayment('cash');
        });
    }
    
    // Promo code application
    const promoCodeInput = document.getElementById('promoCode');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoMessage = document.getElementById('promoMessage');
    
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = promoCodeInput.value.trim();
            
            if (!promoCode) {
                showPromoMessage('Please enter a promo code.', 'error');
                return;
            }
            
            // Simulate promo code validation
            // In a real implementation, this would make an AJAX request to the server
            setTimeout(function() {
                // For demo purposes, let's accept "MEGACITY20" as a valid promo code
                if (promoCode.toUpperCase() === 'MEGACITY20') {
                    // Apply 20% discount
                    applyDiscount(20);
                    showPromoMessage('Promo code applied! You got 20% off.', 'success');
                } else {
                    showPromoMessage('Invalid promo code. Please try again.', 'error');
                }
            }, 1000);
        });
    }
    
    // Function to load booking details
    function loadBookingDetails() {
        // In a real implementation, this would come from URL parameters or session storage
        // For demo purposes, let's use mock data
        const bookingDetails = {
            bookingId: 'BK' + Math.floor(1000000 + Math.random() * 9000000),
            pickupLocation: '123 Main St, Megacity',
            destination: '456 Park Ave, Megacity',
            pickupDateTime: '2025-03-15, 10:30 AM',
            vehicleType: 'Sedan',
            packageType: 'Standard',
            pricing: {
                baseFare: 25.00,
                distanceCharge: 18.50,
                timeCharge: 8.75,
                bookingFee: 2.50,
                discount: 0, // Will be updated if a promo code is applied
                total: 54.75 // Will be recalculated if a discount is applied
            }
        };
        
        // Populate booking details in the UI
        document.getElementById('bookingId').textContent = bookingDetails.bookingId;
        document.getElementById('pickupLocation').textContent = bookingDetails.pickupLocation;
        document.getElementById('destination').textContent = bookingDetails.destination;
        document.getElementById('pickupDateTime').textContent = bookingDetails.pickupDateTime;
        document.getElementById('vehicleType').textContent = bookingDetails.vehicleType;
        document.getElementById('packageType').textContent = bookingDetails.packageType;
        
        // Populate pricing details
        document.getElementById('baseFare').textContent = '$' + bookingDetails.pricing.baseFare.toFixed(2);
        document.getElementById('distanceCharge').textContent = '$' + bookingDetails.pricing.distanceCharge.toFixed(2);
        document.getElementById('timeCharge').textContent = '$' + bookingDetails.pricing.timeCharge.toFixed(2);
        document.getElementById('bookingFee').textContent = '$' + bookingDetails.pricing.bookingFee.toFixed(2);
        document.getElementById('discount').textContent = '-$' + bookingDetails.pricing.discount.toFixed(2);
        document.getElementById('totalAmount').textContent = '$' + bookingDetails.pricing.total.toFixed(2);
        
        // Store the booking details in a global variable for later use
        window.bookingDetails = bookingDetails;
    }
    
    // Function to apply discount
    function applyDiscount(percentageDiscount) {
        if (!window.bookingDetails) return;
        
        const subtotal = window.bookingDetails.pricing.baseFare + 
                         window.bookingDetails.pricing.distanceCharge + 
                         window.bookingDetails.pricing.timeCharge + 
                         window.bookingDetails.pricing.bookingFee;
        
        const discountAmount = (subtotal * percentageDiscount) / 100;
        const newTotal = subtotal - discountAmount;
        
        // Update the booking details object
        window.bookingDetails.pricing.discount = discountAmount;
        window.bookingDetails.pricing.total = newTotal;
        
        // Update the UI
        document.getElementById('discount').textContent = '-$' + discountAmount.toFixed(2);
        document.getElementById('totalAmount').textContent = '$' + newTotal.toFixed(2);
    }
    
    // Function to show promo code messages
    function showPromoMessage(message, type) {
        if (!promoMessage) return;
        
        promoMessage.textContent = message;
        promoMessage.className = 'promo-message';
        
        if (type === 'success') {
            promoMessage.classList.add('success');
        } else if (type === 'error') {
            promoMessage.classList.add('error');
        }
    }
    
    // Function to validate card payment form
    function validateCardPaymentForm() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardholderName = document.getElementById('cardholderName').value;
        
        if (!cardNumber || cardNumber.length < 16) {
            alert('Please enter a valid card number.');
            return false;
        }
        
        if (!expiryDate || !expiryDate.includes('/') || expiryDate.length !== 5) {
            alert('Please enter a valid expiry date (MM/YY).');
            return false;
        }
        
        if (!cvv || cvv.length < 3) {
            alert('Please enter a valid CVV code.');
            return false;
        }
        
        if (!cardholderName) {
            alert('Please enter the cardholder name.');
            return false;
        }
        
        return true;
    }
    
    // Function to process payment
    function processPayment(method, subMethod) {
        // Show loading state
        document.body.style.cursor = 'wait';
        
        // Disable form elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
        
        // Prepare payment data
        const paymentData = {
            bookingId: window.bookingDetails.bookingId,
            amount: window.bookingDetails.pricing.total,
            method: method,
            subMethod: subMethod || null,
            timestamp: new Date().toISOString()
        };
        
        // Simulate payment processing
        // In a real implementation, this would make an AJAX request to the server
        setTimeout(function() {
            // Reset loading state
            document.body.style.cursor = 'default';
            buttons.forEach(button => button.disabled = false);
            
            // Show success message and redirect
            alert(`Payment processed successfully!\nMethod: ${method}${subMethod ? ' (' + subMethod + ')' : ''}\nAmount: $${paymentData.amount.toFixed(2)}`);
            window.location.href = 'customer/bookingHistory.jsp';
        }, 3000);
    }
});