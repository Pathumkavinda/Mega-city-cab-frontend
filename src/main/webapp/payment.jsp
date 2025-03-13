<%-- 
    Document   : payment
    Created on : Mar 13, 2025, 5:14:42 PM
    Author     : Admin
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment - MegacityCabs</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/payment.css">
</head>
<body>
    <jsp:include page="header.jsp" />
    
    <main class="payment-container">
        <section class="payment-hero">
            <h1>Payment</h1>
            <p class="tagline">Complete your booking securely</p>
        </section>
        
        <section class="payment-content">
            <div class="booking-summary">
                <h2>Booking Summary</h2>
                <div class="summary-card">
                    <div class="booking-details">
                        <div class="detail-item">
                            <span class="detail-label">Booking ID:</span>
                            <span class="detail-value" id="bookingId"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Pickup Location:</span>
                            <span class="detail-value" id="pickupLocation"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Destination:</span>
                            <span class="detail-value" id="destination"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Pickup Date & Time:</span>
                            <span class="detail-value" id="pickupDateTime"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Vehicle Type:</span>
                            <span class="detail-value" id="vehicleType"></span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Package:</span>
                            <span class="detail-value" id="packageType"></span>
                        </div>
                    </div>
                    
                    <div class="price-breakdown">
                        <h3>Price Breakdown</h3>
                        <div class="price-item">
                            <span class="price-label">Base Fare:</span>
                            <span class="price-value" id="baseFare"></span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Distance Charge:</span>
                            <span class="price-value" id="distanceCharge"></span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Time Charge:</span>
                            <span class="price-value" id="timeCharge"></span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Booking Fee:</span>
                            <span class="price-value" id="bookingFee"></span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Discount:</span>
                            <span class="price-value" id="discount"></span>
                        </div>
                        <div class="price-item total">
                            <span class="price-label">Total Amount:</span>
                            <span class="price-value" id="totalAmount"></span>
                        </div>
                    </div>
                </div>
                
                <div class="promo-code">
                    <h3>Have a Promo Code?</h3>
                    <div class="promo-form">
                        <input type="text" id="promoCode" placeholder="Enter promo code">
                        <button id="applyPromoBtn">Apply</button>
                    </div>
                    <p id="promoMessage" class="promo-message"></p>
                </div>
            </div>
            
            <div class="payment-options">
                <h2>Select Payment Method</h2>
                
                <div class="payment-tabs">
                    <button class="tab-btn active" data-tab="card">Credit/Debit Card</button>
                    <button class="tab-btn" data-tab="wallet">Digital Wallet</button>
                    <button class="tab-btn" data-tab="cash">Cash to Driver</button>
                </div>
                
                <div class="payment-tab-content">
                    <div class="tab-pane active" id="cardTab">
                        <form id="cardPaymentForm" class="payment-form">
                            <div class="form-group">
                                <label for="cardNumber">Card Number</label>
                                <div class="card-input">
                                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                                    <div class="card-icons">
                                        <i class="fab fa-cc-visa"></i>
                                        <i class="fab fa-cc-mastercard"></i>
                                        <i class="fab fa-cc-amex"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group half">
                                    <label for="expiryDate">Expiry Date</label>
                                    <input type="text" id="expiryDate" placeholder="MM/YY" required>
                                </div>
                                <div class="form-group half">
                                    <label for="cvv">CVV</label>
                                    <input type="text" id="cvv" placeholder="123" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="cardholderName">Cardholder Name</label>
                                <input type="text" id="cardholderName" placeholder="John Smith" required>
                            </div>
                            
                            <div class="form-group checkbox">
                                <input type="checkbox" id="saveCard">
                                <label for="saveCard">Save this card for future payments</label>
                            </div>
                            
                            <button type="submit" class="payment-btn">Pay Now</button>
                        </form>
                    </div>
                    
                    <div class="tab-pane" id="walletTab">
                        <div class="wallet-options">
                            <div class="wallet-option">
                                <input type="radio" name="walletType" id="paypal" value="paypal">
                                <label for="paypal">
                                    <div class="wallet-icon"><i class="fab fa-paypal"></i></div>
                                    <span>PayPal</span>
                                </label>
                            </div>
                            
                            <div class="wallet-option">
                                <input type="radio" name="walletType" id="applepay" value="applepay">
                                <label for="applepay">
                                    <div class="wallet-icon"><i class="fab fa-apple-pay"></i></div>
                                    <span>Apple Pay</span>
                                </label>
                            </div>
                            
                            <div class="wallet-option">
                                <input type="radio" name="walletType" id="googlepay" value="googlepay">
                                <label for="googlepay">
                                    <div class="wallet-icon"><i class="fab fa-google-pay"></i></div>
                                    <span>Google Pay</span>
                                </label>
                            </div>
                        </div>
                        
                        <button id="walletPayBtn" class="payment-btn">Continue with Selected Wallet</button>
                    </div>
                    
                    <div class="tab-pane" id="cashTab">
                        <div class="cash-payment-info">
                            <div class="info-icon"><i class="fas fa-info-circle"></i></div>
                            <div class="info-text">
                                <h3>Cash Payment to Driver</h3>
                                <p>You will pay the exact amount directly to the driver at the end of your journey. Please ensure you have the exact amount ready to facilitate a smooth transaction.</p>
                                <ul>
                                    <li>The driver does not carry change for large bills</li>
                                    <li>You will receive a receipt via email</li>
                                    <li>Tipping is appreciated but not mandatory</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="form-group checkbox">
                            <input type="checkbox" id="confirmCash">
                            <label for="confirmCash">I confirm that I will pay the full amount in cash to the driver</label>
                        </div>
                        
                        <button id="cashPayBtn" class="payment-btn" disabled>Confirm Cash Payment</button>
                    </div>
                </div>
            </div>
            
            <div class="payment-security">
                <h3>Secure Payment</h3>
                <p>All payments are processed securely with industry-standard encryption.</p>
                <div class="security-icons">
                    <i class="fas fa-lock"></i>
                    <i class="fas fa-shield-alt"></i>
                </div>
            </div>
        </section>
    </main>
    
    <jsp:include page="footer.jsp" />
    
    <script src="js/common.js"></script>
    <script src="js/payment.js"></script>
</body>
</html>
