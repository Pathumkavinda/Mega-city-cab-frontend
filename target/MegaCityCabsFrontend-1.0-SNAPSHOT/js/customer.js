// ✅ Check if the user is logged in as a Customer
function checkCustomerSession() {
    let userId = sessionStorage.getItem("userId");
    let userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "user") {
        alert("🚫 Unauthorized Access! Redirecting to login...");
        sessionStorage.clear();
        window.location.href = "../login.jsp";
    }
}

// ✅ Run session check on page load
document.addEventListener("DOMContentLoaded", function () {
    checkCustomerSession();
});
// ✅ Utility Function: Get Element by ID with Error Handling
function getElement(id, errorMessage = "") {
    const element = document.getElementById(id);
    if (!element && errorMessage) {
        console.error(`❌ Element not found: #${id} - ${errorMessage}`);
    }
    return element;
}

document.addEventListener("DOMContentLoaded", function () {
    checkCustomerSession();
    setupNavigation();

    const currentPage = window.location.pathname.split("/").pop();

    switch (currentPage) {
        case "customerDash.jsp":
            if (typeof loadCustomerDashboard === "function") {
                loadCustomerDashboard();
            } else {
                console.error("❌ loadCustomerDashboard function is missing or not loaded.");
            }
            break;
            
        case "bookRide.jsp":
            loadCategoriesForBooking();
            setupBookingForm();
            break;

        case "bookingHistory.jsp":
            loadBookingHistory();
            break;

        case "customerProfile.jsp":
            loadCustomerProfile();
            setupProfileForms();
            break;

        default:
            console.warn("No specific function assigned for this page.");
            break;
    }
});

// ✅ Setup Booking Form (Ensures Proper Defaults)
function setupBookingForm() {
    const bookingForm = getElement("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();
            showBookingSummary();
        });
    }

    const today = new Date().toISOString().split("T")[0];

    // ✅ Ensure input elements exist before setting values
    ["startDate", "endDate", "distanceStartDate"].forEach(id => {
        const input = getElement(id);
        if (input) input.min = today;
    });

    const pickupTimeInput = getElement("pickupTime");
    if (pickupTimeInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        pickupTimeInput.value = `${hours}:${minutes}`;
    }
}

// ✅ Setup Profile Page Forms
function setupProfileForms() {
    const updateProfileForm = getElement("updateProfileForm");
    if (updateProfileForm) {
        updateProfileForm.addEventListener("submit", updateProfile);
    }

    const changePasswordForm = getElement("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", changePassword);
    }
}

// ✅ Check if the user is logged in as a Customer
function checkCustomerSession() {
    const userRole = sessionStorage.getItem("userRole");

    if (userRole !== "user") {
        alert("🚫 Unauthorized Access! Redirecting to login...");
        window.location.href = "../login.jsp";
    }
}

// ✅ Set up navigation behavior (highlight active page)
function setupNavigation() {
    const navLinks = document.querySelectorAll("nav ul li a");
    const currentPath = window.location.pathname.split("/").pop(); // Get current filename

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active"); // Add active class for styling
        }
    });
}
// Helper Functions
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
}

function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    if (!timeString) return "N/A"; // Handle empty/null values
    let [hours, minutes] = timeString.split(":");
    
    // Ensure hours and minutes are numbers
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    if (isNaN(hours) || isNaN(minutes)) return "Invalid Time";

    let ampm = hours >= 12 ? "PM" : "AM";
    let formattedHour = hours % 12 || 12; // Convert 24-hour to 12-hour format

    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// ✅ API Endpoints
const userApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/users";
const bookingApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/bookings";
const categoryApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/categories";
const driverApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/drivers";
const vehicleApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/vehicles";
const ratingsApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/ratings";


// ✅ Logout function (Clears session and redirects to login page)
function logout() {
    sessionStorage.clear();
    alert("Logging out...");
    window.location.href = "../login.jsp";
}
// ==============================================================================================================================
//                                                  🔹 Customer Dashboard
// ==============================================================================================================================


function loadCustomerDashboard() {
    let userId = sessionStorage.getItem("userId");

    if (!userId) {
        alert("⚠️ User not found. Please log in again.");
        window.location.href = "../login.jsp";
        return;
    }

    loadUserGreeting();
    loadCustomerStats(userId);
    loadUpcomingTrip(userId);
    loadRecentBookings(userId);
    loadCustomerInfo();
}
// ✅ Load Customer Info
function loadCustomerInfo() {
    let userId = sessionStorage.getItem("userId"); // Get stored session user ID
    if (!userId) {
        window.location.href = "../login.jsp"; // Redirect to login if not logged in
        return;
    }

    fetch(`${userApiUrl}/${userId}`) // Fetch user details from API
        .then(response => response.json())
        .then(user => {
            document.getElementById("customerName").textContent = user.fullName || "Customer";
        })
        .catch(error => {
            console.error("❌ Error fetching user info:", error);
        });
}


// ✅ Load User Greeting
function loadUserGreeting() {
    let userEmail = sessionStorage.getItem("userEmail") || "Customer";
    let userName = userEmail.includes("@") ? userEmail.split('@')[0] : userEmail;
    let customerNameEl = document.getElementById("customer-name");
    if (customerNameEl) {
        customerNameEl.textContent = `Welcome, ${userName}!`;
    }
}


// ✅ Load Customer Statistics (Active Bookings, Past Rides, Average Rating)
function loadCustomerStats(userId) {
    // Get elements
    const activeBookingsEl = getElement("activeBookingsCount");
    const pastRidesEl = getElement("pastRidesCount");
    const averageRatingEl = getElement("averageRating");

    // Fetch user bookings
    fetch(`${bookingApiUrl}/user/${userId}`)
        .then(response => response.json())
        .then(bookings => {
            if (!bookings || bookings.length === 0) {
                if (activeBookingsEl) activeBookingsEl.textContent = "0";
                if (pastRidesEl) pastRidesEl.textContent = "0";
                if (averageRatingEl) averageRatingEl.textContent = "0.0";
                return;
            }

            let currentDate = new Date();
            let completedBookingIds = [];
            let totalRating = 0, ratingCount = 0;

            let activeBookings = bookings.filter(booking => 
                new Date(booking.startDate) > currentDate && booking.stat === "Confirmed"
            ).length;

            let pastRides = bookings.filter(booking => 
                new Date(booking.startDate) < currentDate && new Date(booking.endDate) < currentDate
            ).length;

            // ✅ Find Completed Bookings to Calculate Rating
            let completedBookings = bookings.filter(booking => 
                new Date(booking.startDate) < currentDate && 
                new Date(booking.endDate) < currentDate && 
                booking.stat === "Confirmed"
            );

            completedBookingIds = completedBookings.map(booking => booking.id);

            if (activeBookingsEl) activeBookingsEl.textContent = activeBookings.toString();
            if (pastRidesEl) pastRidesEl.textContent = pastRides.toString();

            // ✅ Fetch Ratings and Calculate Average
            if (completedBookingIds.length > 0) {
                fetch(`${ratingsApiUrl}`)
                    .then(response => response.json())
                    .then(ratings => {
                        ratings.forEach(rating => {
                            if (completedBookingIds.includes(rating.bookingId)) {
                                totalRating += rating.rating;
                                ratingCount++;
                            }
                        });

                        let averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";
                        if (averageRatingEl) averageRatingEl.textContent = averageRating;
                    })
                    .catch(error => {
                        console.error("❌ Error fetching ratings:", error);
                        if (averageRatingEl) averageRatingEl.textContent = "0.0";
                    });
            } else {
                if (averageRatingEl) averageRatingEl.textContent = "0.0";
            }
        })
        .catch(error => {
            console.error("❌ Error loading customer stats:", error);
            if (activeBookingsEl) activeBookingsEl.textContent = "0";
            if (pastRidesEl) pastRidesEl.textContent = "0";
            if (averageRatingEl) averageRatingEl.textContent = "0.0";
        });
}


// ✅ Load Upcoming Trip
function loadUpcomingTrip(userId) {
    const tripInfoContainer = document.getElementById("tripInfo");
    if (!tripInfoContainer) return;
    
    fetch(`${bookingApiUrl}/user/${userId}`)
        .then(response => response.json())
        .then(bookings => {
            if (!bookings || bookings.length === 0) {
                showNoTripsMessage(tripInfoContainer);
                return;
            }
            
            const currentDate = new Date();
            const upcomingTrip = bookings.find(b => new Date(b.startDate) >= currentDate && (b.stat === "Confirmed" || b.stat === "Pending"));
            
            if (!upcomingTrip) {
                showNoTripsMessage(tripInfoContainer);
                return;
            }
            
            fetch(`${vehicleApiUrl}/${upcomingTrip.vehicleId}`)
                .then(res => res.json())
                .then(vehicle => {
                    fetch(`${categoryApiUrl}/${vehicle.catId}`)
                        .then(res => res.json())
                        .then(category => {
                            tripInfoContainer.innerHTML = `
                                <div class="booking-card">
                                    <div class="booking-header">
                                        <span class="booking-id">Booking #${upcomingTrip.id}</span>
                                        <span class="booking-status status-${upcomingTrip.stat.toLowerCase()}">${upcomingTrip.stat}</span>
                                    </div>
                                    <div class="trip-info">
                                        <p><strong>Date:</strong> ${new Date(upcomingTrip.startDate).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> ${formatTime(upcomingTrip.pickupTime)}</p>
                                        <p><strong>Vehicle Type:</strong> ${category.catName}</p>
                                        <p><strong>Vehicle:</strong> ${vehicle.model || 'N/A'}</p>
                                    </div>
                                    <div class="trip-addresses">
                                        <p><strong>Pickup:</strong> ${upcomingTrip.pickupLocation}</p>
                                        <p><strong>Destination:</strong> ${upcomingTrip.destination}</p>
                                    </div>
                                    <div class="trip-actions">
                                        <button class="primary-btn" onclick="viewBookingDetails(${upcomingTrip.id})">View Details</button>
                                        ${upcomingTrip.stat !== "Cancelled" ? `<button class="secondary-btn" onclick="updateBookingStatus(${upcomingTrip.id}, 'Cancelled')">Cancel Trip</button>` : ''}
                                    </div>
                                </div>
                            `;
                        });
                });
        })
        .catch(error => console.error("❌ Error loading trip:", error));
}

// ✅ Load Recent Bookings
function loadRecentBookings(userId) {
    const bookingsListContainer = document.getElementById("bookings-list");
    if (!bookingsListContainer) return;
    
    fetch(`${bookingApiUrl}/user/${userId}`)
        .then(response => response.json())
        .then(bookings => {
            if (!bookings || bookings.length === 0) {
                bookingsListContainer.innerHTML = `<p>No booking history found.</p>`;
                return;
            }
            
            const recentBookings = bookings.slice(0, 3);
            let html = "";
            recentBookings.forEach(booking => {
                html += `
                    <div class="booking-card">
                        <div class="booking-header">
                            <span class="booking-id">Booking #${booking.id}</span>
                            <span class="booking-status status-${booking.stat.toLowerCase()}">${booking.stat}</span>
                        </div>
                        <div class="booking-info">
                            <p><strong>Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                            <p><strong>Pickup:</strong> ${booking.pickupLocation}</p>
                            <p><strong>Destination:</strong> ${booking.destination}</p>
                        </div>
                        <div class="booking-actions">
                            <button class="view-btn" onclick="viewBookingDetails(${booking.id})">View Details</button>
                        </div>
                    </div>
                `;
            });
            bookingsListContainer.innerHTML = html;
        })
        .catch(error => console.error("❌ Error loading bookings:", error));
}

// ✅ Helper Functions
function showNoTripsMessage(container) {
    container.innerHTML = `<p>No upcoming trips. Book now!</p>`;
}
function viewBookingDetails(bookingId) {
    window.location.href = `bookingHistory.jsp?bookingId=${bookingId}`;
}

// ==============================================================================================================================
//                                                  🔹 Customer Book A Ride
// ==============================================================================================================================


// ✅ Load Categories for Booking
function loadCategoriesForBooking() {
    fetch(categoryApiUrl)
        .then(response => response.json())
        .then(categories => {
            let categoryContainer = document.getElementById("categoryCards");
            categoryContainer.innerHTML = ""; // Clear existing categories

            categories.forEach(category => {
                let card = `<div class="category-card" id="category-${category.id}" onclick="selectCategory(${category.id}, '${category.catName}', ${category.perDayPrice}, ${category.perDayKm}, ${category.perKm})">
                    <h3>${category.catName}</h3>
                    <p>Max Passengers: ${category.maxPassengers}</p>
                </div>`;
                categoryContainer.innerHTML += card;
            });
        })
        .catch(error => console.error("Error loading categories:", error));
}


// ✅ Select Category & Show Step 2
function selectCategory(catId, catName, perDayPrice, perDayKm, perKm) {
    const selectedCategory = { catId, catName, perDayPrice, perDayKm, perKm };
    sessionStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));

    // ✅ Highlight selected category
    document.querySelectorAll(".category-card").forEach(card => card.classList.remove("selected-category"));
    document.getElementById(`category-${catId}`).classList.add("selected-category");

    // ✅ Update UI elements
    document.getElementById("perDayPrice").textContent = `$${perDayPrice.toFixed(2)}`;
    document.getElementById("perDayKm").textContent = perDayKm;

    // ✅ Show Step 2 (Booking Plan)
    document.getElementById("bookingOptions").style.display = "block"; // Show Booking Plan
    document.querySelector(".distance-package-container").style.display = "none"; // Hide distance options

    // ✅ Keep category selection visible
    document.getElementById("categorySelection").style.display = "block";
}



// ✅ Toggle Booking Type (Per Day / Distance)
function toggleBookingType(type) {
    sessionStorage.setItem("bookingType", type);

    let perDayOptions = document.getElementById("perDayOptions");
    let distanceOptions = document.querySelector(".distance-package-container");
    let distanceDateSelection = document.getElementById("distanceDateSelection");
    let perDayCard = document.getElementById("perDayCard");
    let distanceCard = document.getElementById("distanceCard");

    // ✅ Ensure all elements exist before modifying
    if (!perDayOptions || !distanceOptions || !distanceDateSelection || !perDayCard || !distanceCard) {
        console.error("⚠️ Error: Booking option elements not found!");
        return;
    }

    // ✅ Show Step 2 (Booking Plan)
    document.getElementById("bookingOptions").style.display = "block";

    if (type === "perDay") {
        perDayOptions.style.display = "block";
        distanceOptions.style.display = "none";
        distanceDateSelection.style.display = "none";

        // ✅ Highlight Selected Booking Type
        perDayCard.classList.add("selected-booking-type");
        distanceCard.classList.remove("selected-booking-type");

        // ✅ Reset Distance Package Selection
        document.querySelectorAll(".distance-package-card").forEach(card => card.classList.remove("selected-package"));
        sessionStorage.removeItem("selectedDistancePackage"); // Remove previously selected distance package

    } else {
        perDayOptions.style.display = "none";
        distanceOptions.style.display = "flex";
        distanceDateSelection.style.display = "flex";

        // ✅ Highlight Selected Booking Type
        distanceCard.classList.add("selected-booking-type");
        perDayCard.classList.remove("selected-booking-type");

        // ✅ Auto-select 50KM Package as Default
        selectDistancePackage(50);
    }
}



// ✅ Select Distance Package & Highlight Selection
function selectDistancePackage(km) {
    let selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));

    let discount = km == 50 ? 0.8 : 0.9; // 20% for 50km, 10% for 100km
    let packagePrice = (km * selectedCategory.perKm * discount).toFixed(2);

    // ✅ Store selected package in session
    sessionStorage.setItem("selectedDistancePackage", JSON.stringify({ km, packagePrice }));

    // ✅ Update the price on UI
    document.getElementById(`distancePrice${km}`).textContent = `$${packagePrice}`;

    // ✅ Highlight selected package
    document.querySelectorAll(".distance-package-card").forEach(card => card.classList.remove("selected-package"));
    document.getElementById(`distance-${km}`).classList.add("selected-package");
}



// ✅ Update Distance Package Prices when "Distance" is selected
function updateDistancePrice() {
    let selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));

    if (!selectedCategory || !selectedCategory.perKm) {
        console.error("Error: Category data is missing or invalid.");
        return;
    }

    // ✅ Calculate prices for both packages
    let price50 = (50 * selectedCategory.perKm * 0.8).toFixed(2);
    let price100 = (100 * selectedCategory.perKm * 0.9).toFixed(2);

    // ✅ Update UI with calculated prices
    document.getElementById("distancePrice50").textContent = `$${price50}`;
    document.getElementById("distancePrice100").textContent = `$${price100}`;
}


// ✅ Show Booking Summary (Enhanced Validation)
function showBookingSummary() {
    let bookingType = sessionStorage.getItem("bookingType");
    let selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));

    if (!selectedCategory) {
        alert("⚠️ Please select a vehicle category first.");
        return;
    }

    if (!bookingType) {
        alert("⚠️ Please select a booking type.");
        return;
    }

    let pickupLocation = document.getElementById("pickupLocation")?.value.trim();
    let destination = document.getElementById("destination")?.value.trim();
    let pickupTime = document.getElementById("pickupTime")?.value;

    // ✅ Validate Common Fields
    if (!pickupLocation || !destination || !pickupTime) {
        alert("⚠️ Please fill in all required fields (Pickup Location, Destination, and Pickup Time).");
        return;
    }

    let startDateElement, endDate, startDate;

    if (bookingType === "perDay") {
        startDateElement = document.getElementById("startDate");
        let endDateElement = document.getElementById("endDate");

        if (!startDateElement || !endDateElement) {
            console.error("⚠️ Error: Date elements not found.");
            alert("⚠️ Error loading date fields. Please try again.");
            return;
        }

        startDate = startDateElement.value;
        endDate = endDateElement.value;

        // ✅ Ensure dates are selected
        if (!startDate || !endDate) {
            alert("⚠️ Please select both Start Date and End Date.");
            return;
        }

        // ✅ Ensure End Date is after Start Date
        if (new Date(startDate) > new Date(endDate)) {
            alert("⚠️ End Date must be greater than Start Date.");
            return;
        }
    } else {
        startDateElement = document.getElementById("distanceStartDate");

        if (!startDateElement) {
            console.error("⚠️ Error: Distance date element not found.");
            alert("⚠️ Error loading booking date. Please try again.");
            return;
        }

        startDate = startDateElement.value;
        endDate = startDate; // ✅ Auto-set end date to start date for distance packages

        // ✅ Ensure booking date is selected
        if (!startDate) {
            alert("⚠️ Please select a booking date.");
            return;
        }

        // ✅ Ensure a distance package is selected
        let selectedPackage = JSON.parse(sessionStorage.getItem("selectedDistancePackage"));
        if (!selectedPackage) {
            alert("⚠️ Please select a distance package.");
            return;
        }

        priceDetails = `<p><strong>Package:</strong> ${selectedPackage.km} Km</p>
                        <p><strong>Estimated Price:</strong> $${selectedPackage.packagePrice}</p>`;
    }

    // ✅ Construct Booking Summary
    let summary = `<p><strong>Vehicle Category:</strong> ${selectedCategory.catName}</p>
                   <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
                   <p><strong>Destination:</strong> ${destination}</p>
                   <p><strong>Pickup Time:</strong> ${pickupTime}</p>
                   <p><strong>Start Date:</strong> ${startDate}</p>
                   <p><strong>End Date:</strong> ${endDate}</p>
                   ${bookingType === "distance" ? priceDetails : ""}`;

    // ✅ Update UI & Show Summary Modal
    document.getElementById("summaryDetails").innerHTML = summary;
    document.getElementById("summaryModal").style.display = "block";
}


// ==== Add jsPDF library reference to your HTML file ====
// Add this to your HTML head section
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>

// ✅ Generate and download PDF of booking summary
function generateBookingPDF(bookingData, vehicleCategory) {
    // Create new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add logo/header
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("MegaCity Cabs", 105, 20, { align: "center" });
    
    // Add booking confirmation title
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 0);
    doc.text("Booking Confirmation", 105, 30, { align: "center" });
    
    // Add booking reference number and date
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Booking ID: ${bookingData.id || "Pending"}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Customer details
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Customer Details", 20, 60);
    
    // Customer info table
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const customerInfo = [
        ["Customer ID", bookingData.userId],
        ["Pickup Location", bookingData.pickupLocation],
        ["Destination", bookingData.destination],
        ["Pickup Time", formatTime(bookingData.pickupTime)],
        ["Start Date", formatDate(bookingData.startDate)],
        ["End Date", formatDate(bookingData.endDate)],
    ];
    
    doc.autoTable({
        startY: 65,
        head: [],
        body: customerInfo,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 102] },
        styles: { overflow: 'linebreak', cellWidth: 'auto' },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 80 }
        }
    });
    
    // Ride details
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Ride Details", 20, doc.previousAutoTable.finalY + 10);
    
    // Ride info table
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const rideInfo = [
        ["Vehicle Category", vehicleCategory.catName],
        ["Driver ID", bookingData.driverId],
        ["Final Price", `Rs ${bookingData.finalPrice.toFixed(2)}`],
        ["Status", bookingData.stat]
    ];
    
    doc.autoTable({
        startY: doc.previousAutoTable.finalY + 15,
        head: [],
        body: rideInfo,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 102] },
        styles: { overflow: 'linebreak', cellWidth: 'auto' },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 80 }
        }
    });
    
    // Terms and conditions
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Terms and Conditions:", 20, doc.previousAutoTable.finalY + 15);
    doc.setFontSize(8);
    const terms = [
        "1. Cancellations within 24 hours of pickup time will incur a 50% charge.",
        "2. Driver will wait up to 15 minutes at the pickup location.",
        "3. Additional charges apply for excess kilometers.",
        "4. A valid ID is required at pickup."
    ];
    
    let yPos = doc.previousAutoTable.finalY + 20;
    terms.forEach(term => {
        doc.text(term, 20, yPos);
        yPos += 5;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("Thank you for choosing MegaCity Cabs!", 105, yPos + 10, { align: "center" });
    doc.text("For support, contact us at support@megacitycabs.com", 105, yPos + 15, { align: "center" });
    
    // Generate the PDF
    const bookingDate = new Date(bookingData.startDate).toISOString().slice(0,10);
    const filename = `MegaCityCabs_Booking_${bookingDate}.pdf`;
    doc.save(filename);
    
    return filename;
}

// ✅ Modify confirmBooking function to include PDF generation
async function confirmBooking() {
    try {
        const selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));
        const bookingType = sessionStorage.getItem("bookingType");
        const selectedPackage = JSON.parse(sessionStorage.getItem("selectedDistancePackage"));

        let userId = sessionStorage.getItem("userId");
        let pickupLocation = document.getElementById("pickupLocation").value.trim();
        let destination = document.getElementById("destination").value.trim();
        let pickupTime = document.getElementById("pickupTime").value;
        let startDate = bookingType === "perDay" ? document.getElementById("startDate").value : document.getElementById("distanceStartDate").value;
        let endDate = bookingType === "perDay" ? document.getElementById("endDate").value : startDate; // ✅ Distance: End Date = Start Date

        // ✅ Fetch Random Available Driver
        let driversResponse = await fetch(driverApiUrl);
        let drivers = await driversResponse.json();
        let availableDrivers = drivers.filter(driver => driver.stat === "Active");
        let selectedDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];

        // ✅ Fetch Random Available Vehicle
        let vehicleResponse = await fetch(`${vehicleApiUrl}/category/random/${selectedCategory.catId}`);
        let selectedVehicle = await vehicleResponse.json();

        // ✅ Calculate Final Price (Per Day vs Distance)
        let finalPrice;
        if (bookingType === "perDay") {
            let days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
            finalPrice = (days * selectedCategory.perDayPrice).toFixed(2);
        } else {
            if (!selectedPackage) {
                alert("⚠️ Please select a distance package.");
                return;
            }
            finalPrice = selectedPackage.packagePrice; // ✅ Fetch the stored package price
        }

        // ✅ Booking Object
        let bookingData = {
            userId: parseInt(userId),
            vehicleId: selectedVehicle.id,
            driverId: selectedDriver.id,
            pickupLocation: pickupLocation,
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            pickupTime: pickupTime,
            finalPrice: parseFloat(finalPrice),
            stat: "Confirmed"
        };

        // ✅ Submit to API
        let response = await fetch(`${bookingApiUrl}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) throw new Error("Booking failed");
        
        const bookingResult = await response.json();
        
        // Update booking data with ID from response if available
        if (bookingResult.id) {
            bookingData.id = bookingResult.id;
        }
        
        // ✅ Generate and download PDF
        generateBookingPDF(bookingData, selectedCategory);

        alert("🚖 Booking Confirmed! Your receipt has been downloaded.");
        window.location.href = "bookingHistory.jsp";

    } catch (error) {
        console.error("❌ Error:", error);
        alert("⚠️ An error occurred while processing your booking. Please try again.");
    }
}

// ✅ Also create a function to download receipt for existing bookings
async function downloadBookingReceipt(bookingId) {
    try {
        // Fetch booking details
        const bookingResponse = await fetch(`${bookingApiUrl}/${bookingId}`);
        if (!bookingResponse.ok) throw new Error("Failed to fetch booking details");
        const bookingData = await bookingResponse.json();
        
        // Fetch vehicle details to get category
        const vehicleResponse = await fetch(`${vehicleApiUrl}/${bookingData.vehicleId}`);
        if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicle details");
        const vehicleData = await vehicleResponse.json();
        
        // Fetch category details
        const categoryResponse = await fetch(`${categoryApiUrl}/${vehicleData.catId}`);
        if (!categoryResponse.ok) throw new Error("Failed to fetch category details");
        const categoryData = await categoryResponse.json();
        
        // Generate PDF
        generateBookingPDF(bookingData, categoryData);
        
    } catch (error) {
        console.error("❌ Error generating booking receipt:", error);
        alert("⚠️ An error occurred while generating your receipt. Please try again.");
    }
}


// ✅ Close Summary Modal
function closeSummaryModal() {
    document.getElementById("summaryModal").style.display = "none";
}
// Go Back to Category Selection
function goBack() {
    document.getElementById("bookingOptions").style.display = "none";
    document.getElementById("categorySelection").style.display = "block";
    
    // Scroll to top of categorySelection section
    document.getElementById("categorySelection").scrollIntoView({ behavior: 'smooth' });
}

// Show Terms and Conditions
function showTerms() {
    alert("Terms and Conditions:\n\n1. Cancellations within 24 hours of pickup time will incur a 50% charge.\n2. Driver will wait up to 15 minutes at the pickup location.\n3. Additional charges apply for excess kilometers.\n4. A valid ID is required at pickup.");
    return false; // Prevent default link behavior
}

function setupAgreeTermsListener() {
    const agreeTermsCheckbox = document.getElementById("agreeTerms");
    if (agreeTermsCheckbox) {
        agreeTermsCheckbox.addEventListener("change", function() {
            const confirmBtn = document.getElementById("confirmBookingBtn");
            if (confirmBtn) {
                confirmBtn.disabled = !this.checked;
            }
        });
    }
}
function toggleConfirmButton(isChecked) {
    const confirmBtn = document.getElementById("confirmBookingBtn");
    if (confirmBtn) {
        confirmBtn.disabled = !isChecked;
    }
}
// ==============================================================================================================================
//                                                  🔹 Customer Booking History
// ==============================================================================================================================
// ✅ Load Booking History with Category & Driver Details
async function loadBookingHistory() {
    let userId = sessionStorage.getItem("userId");

    if (!userId) {
        alert("⚠️ You must be logged in to view booking history!");
        window.location.href = "../login.jsp";
        return;
    }

    try {
        // Fetch bookings and ratings in parallel
        let [bookingsResponse, ratingsResponse] = await Promise.all([
            fetch(`${bookingApiUrl}/user/${userId}`),
            fetch(`${ratingsApiUrl}`)
        ]);

        if (!bookingsResponse.ok) throw new Error("⚠️ Failed to load bookings.");
        if (!ratingsResponse.ok) throw new Error("⚠️ Failed to load ratings.");

        let bookings = await bookingsResponse.json();
        let ratings = await ratingsResponse.json();

        let bookingTable = document.getElementById("bookingTableBody");
        if (!bookingTable) {
            console.error("⚠️ Booking table not found.");
            return;
        }

        bookingTable.innerHTML = ""; // Clear previous data

        if (bookings.length === 0) {
            bookingTable.innerHTML = "<tr><td colspan='11'>No bookings found.</td></tr>";
            return;
        }

        let ratedBookings = new Map();
        ratings.forEach(rating => {
            ratedBookings.set(rating.bookingId, rating);
        });

        for (let booking of bookings) {
            let statusClass = booking.stat.toLowerCase() === "pending" ? "status-pending" :
                              booking.stat.toLowerCase() === "confirmed" ? "status-confirmed" :
                              "status-cancelled";

            let startDate = new Date(booking.startDate);
            let endDate = new Date(booking.endDate);
            let currentDate = new Date();
            let actionButtons = "";

            // ✅ Show "Cancel Trip" button if trip is confirmed & has not started
            if (currentDate < startDate && booking.stat === "Confirmed") {
                actionButtons += `<button class="cancel-btn" onclick="updateBookingStatus(${booking.id}, 'Cancelled')">Cancel Trip</button>`;
            }

            // ✅ Show "Rate Trip" button if trip has ended and has NOT been rated
            if (currentDate > endDate && !ratedBookings.has(booking.id)) {
                actionButtons += `<button class="rate-btn" onclick="openRatingModal(${booking.id})">Rate Trip</button>`;
            }

            // ✅ Show the rating if trip is already rated
            if (ratedBookings.has(booking.id)) {
                let ratingData = ratedBookings.get(booking.id);
                actionButtons += `<div class="rating-display">⭐ ${ratingData.rating}/5</div>`;
            }

            // ✅ Fetch Vehicle Category Name
            let vehicleCategoryName = "Loading...";
            try {
                let vehicleResponse = await fetch(`${vehicleApiUrl}/${booking.vehicleId}`);
                if (vehicleResponse.ok) {
                    let vehicleData = await vehicleResponse.json();
                    let categoryResponse = await fetch(`${categoryApiUrl}/${vehicleData.catId}`);
                    if (categoryResponse.ok) {
                        let categoryData = await categoryResponse.json();
                        vehicleCategoryName = categoryData.catName;
                    }
                }
            } catch (error) {
                console.error("⚠️ Error fetching vehicle category:", error);
            }

            // ✅ Fetch Driver Full Name
            let driverFullName = "Loading...";
            try {
                let driverResponse = await fetch(`${driverApiUrl}/${booking.driverId}`);
                if (driverResponse.ok) {
                    let driverData = await driverResponse.json();
                    let userResponse = await fetch(`${userApiUrl}/${driverData.userId}`);
                    if (userResponse.ok) {
                        let userData = await userResponse.json();
                        driverFullName = userData.fullName;
                    }
                }
            } catch (error) {
                console.error("⚠️ Error fetching driver name:", error);
            }

            // ✅ Populate Table Row
            let row = `<tr>
                <td>${booking.id}</td>
                <td>${vehicleCategoryName}</td>
                <td>${driverFullName}</td>
                <td>${booking.pickupLocation}</td>
                <td>${booking.destination}</td>
                <td>${booking.startDate}</td>
                <td>${booking.endDate}</td>
                <td>${formatTime(booking.pickupTime)}</td>
                <td>Rs ${booking.finalPrice.toFixed(2)}</td>
                <td class="${statusClass}">${booking.stat}</td>
                <td>${actionButtons}</td>  
            </tr>`;

            bookingTable.innerHTML += row;
        }
    } catch (error) {
        console.error("⚠️ Error loading booking history:", error);
        let bookingTable = document.getElementById("bookingTableBody");
        if (bookingTable) {
            bookingTable.innerHTML = "<tr><td colspan='11'>⚠️ Failed to load bookings.</td></tr>";
        }
    }
}


// ✅ Update Booking Status & Refresh Page if Cancelled
function updateBookingStatus(bookingId, newStatus) {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this trip?`)) return;

    fetch(`${bookingApiUrl}/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update booking status.");
        return response.json();
    })
    .then(data => {
        alert(data.message);

        if (newStatus === "Cancelled") {
            location.reload(); // ✅ Refresh page after cancellation
        } else {
            loadBookingHistory(); // ✅ Reload booking history if not cancelled
        }
    })
    .catch(error => {
        console.error("❌ Error updating booking status:", error);
        alert("⚠️ Unable to update booking. Please try again.");
    });
}

// ✅ Open Rating Modal
function openRatingModal(bookingId) {
    document.getElementById("ratingBookingId").value = bookingId;
    document.getElementById("ratingModal").style.display = "block";
}

// ✅ Close Rating Modal
function closeRatingModal() {
    document.getElementById("ratingModal").style.display = "none";
}

// ✅ Submit Rating & Update Booking Status
function submitRating() {
    let bookingId = parseInt(document.getElementById("ratingBookingId").value);
    let rating = parseInt(document.getElementById("tripRating").value);
    let comment = document.getElementById("tripComment").value.trim();

    if (!bookingId) {
        alert("Booking ID is missing. Please try again.");
        return;
    }

    if (!rating || rating < 1 || rating > 5) {
        alert("Please select a valid rating (1-5 stars).");
        return;
    }

    if (!comment) {
        alert("Please enter a comment about your trip.");
        return;
    }

    let ratingData = { 
        bookingId: bookingId,
        rating: rating, 
        comment: comment 
    };

    // ✅ Step 1: Submit the rating
    fetch(`${ratingsApiUrl}/add`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to submit rating.");
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);

        // ✅ Step 2: Update the booking status to "Completed"
        let statusData = JSON.stringify({ status: "Completed" });

        return fetch(`${bookingApiUrl}/${bookingId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: statusData
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update booking status.");
        }
        return response.json();
    })
    .then(() => {
        alert("Booking status updated to Completed.");
        closeRatingModal();
        loadBookingHistory(); // ✅ Refresh booking history after updating the status
    })
    .catch(error => {
        console.error("Error submitting rating or updating status:", error);
        alert("An error occurred while submitting your rating. Please try again later.");
    });
}

// ==============================================================================================================================
//                                                  🔹 Customer profile manage
// ==============================================================================================================================
// ✅ Load Customer Profile
function loadCustomerProfile() {
    let userId = sessionStorage.getItem("userId");

    if (!userId) {
        alert("⚠️ User not found. Please log in again.");
        window.location.href = "../login.jsp";
        return;
    }

    fetch(`${userApiUrl}/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("⚠️ Failed to fetch user profile.");
            }
            return response.json();
        })
        .then(user => {
            // ✅ Set user data to form fields (ensure elements exist)
            getElement("fullName").value = user.fullName || "N/A";
            getElement("username").value = user.username || "N/A";
            getElement("uRole").value = user.uRole || "N/A";
            getElement("nic").value = user.nic || "N/A";
            getElement("email").value = user.uEmail || "";
            getElement("phone").value = user.phone || "";
            getElement("address").value = user.address || "";
        })
        .catch(error => {
            console.error("❌ Error loading profile:", error);
            alert("⚠️ An error occurred while loading your profile.");
        });
}

// ✅ Update Profile (Fetch All Form Data & Send to API)
function updateProfile(event) {
    event.preventDefault();

    let userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("⚠️ User not found. Please log in again.");
        window.location.href = "../login.jsp";
        return;
    }

    // ✅ Get all form values
    let fullName = getElement("fullName").value.trim();
    let username = getElement("username").value.trim();
    let uRole = getElement("uRole").value.trim(); // ✅ Ensure uRole is retrieved correctly
    let nic = getElement("nic").value.trim();
    let email = getElement("email").value.trim();
    let phone = getElement("phone").value.trim();
    let address = getElement("address").value.trim();

    if (!email || !phone || !address) {
        alert("⚠️ Please fill out all required fields.");
        return;
    }

    // ✅ Disable button to prevent multiple submissions
    let updateButton = getElement("updateProfileForm").querySelector("button");
    updateButton.disabled = true;
    updateButton.textContent = "Updating...";

    // ✅ Check if email exists for other users before updating profile
    fetch(`${userApiUrl}/check-email?userId=${userId}&email=${encodeURIComponent(email)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("⚠️ API not found or email check failed.");
            }
            return response.json();
        })
        .then(data => {
            if (data.exists) {
                alert("❌ This email is already used by another account. Please choose another.");
                updateButton.disabled = false;
                updateButton.textContent = "Update Profile";
                return;
            }

            // ✅ If email is unique, prepare user data for the API
            let userData = {
                id: parseInt(userId), // Ensure correct ID
                fullName: fullName,
                username: username,
                uRole: uRole, // ✅ Fix: Correct assignment (previously had an error)
                nic: nic,
                uEmail: email,
                phone: phone,
                address: address
            };

            return fetch(`${userApiUrl}/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("⚠️ Failed to update profile.");
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            loadCustomerProfile(); // Refresh profile data after update
        })
        .catch(error => {
            console.error("❌ Error updating profile:", error);
            alert("⚠️ An error occurred while updating your profile. Please try again.");
        })
        .finally(() => {
            updateButton.disabled = false;
            updateButton.textContent = "Update Profile";
        });
}


// ✅ Change Password
function changePassword(event) {
    event.preventDefault();

    let userId = sessionStorage.getItem("userId");
    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("⚠️ All fields are required.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("❌ New passwords do not match.");
        return;
    }

    let passwordData = { currentPassword: currentPassword, newPassword: newPassword };

    fetch(`${userApiUrl}/${userId}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || "Failed to change password.");
            });
        }
        return response.json();
    })
    .then(data => {
        alert("✅ Password changed successfully.");
        document.getElementById("changePasswordForm").reset(); // Clear the form
    })
    .catch(error => {
        console.error("❌ Error changing password:", error);
        alert(error.message || "⚠️ An error occurred. Please try again.");
    });
}
