// ✅ Check if the user is logged in as an Admin
function checkAdminSession() {
    let userId = sessionStorage.getItem("userId");
    let userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
        alert("🚫 Unauthorized Access! Redirecting to login...");
        sessionStorage.clear();
        window.location.href = "../login.jsp";
    }
}

// ✅ Run session check on page load & Initialize features
document.addEventListener("DOMContentLoaded", function () {
    checkAdminSession();
    setupNavigation();

    let currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "driverManager.jsp") {
        loadUsers();
        loadDrivers();

        let driverForm = document.getElementById("driverForm");
        if (driverForm) {
            driverForm.addEventListener("submit", addDriver);
        }

        let searchInput = document.getElementById("searchInput");
        let filterStatus = document.getElementById("filterStatus");
        if (searchInput) searchInput.addEventListener("input", filterDrivers);
        if (filterStatus) filterStatus.addEventListener("change", filterDrivers);

    } else if (currentPage === "categoryManager.jsp") {
        loadCategories();

        let categoryForm = document.getElementById("categoryForm");
        if (categoryForm) {
            categoryForm.addEventListener("submit", addCategory);
        }

        let searchInput = document.getElementById("searchInput");
        let filterStatus = document.getElementById("filterStatus");
        if (searchInput) searchInput.addEventListener("input", filterCategories);
        if (filterStatus) filterStatus.addEventListener("change", filterCategories);

    } else if (currentPage === "vehicleManager.jsp") {
        loadVehicles();
        loadCategoriesForVehicles();

        let vehicleForm = document.getElementById("vehicleForm");
        if (vehicleForm) {
            vehicleForm.addEventListener("submit", addVehicle);
        }

        let searchInput = document.getElementById("searchInput");
        let filterStatus = document.getElementById("filterStatus");
        let filterCategory = document.getElementById("filterCategory");
        if (searchInput) searchInput.addEventListener("input", filterVehicles);
        if (filterStatus) filterStatus.addEventListener("change", filterVehicles);
        if (filterCategory) filterCategory.addEventListener("change", filterVehicles);

        // ✅ Fix: Attach the Update Vehicle Status event listener
        let updateVehicleBtn = document.getElementById("confirmUpdateVehicleBtn");
        if (updateVehicleBtn) {
            updateVehicleBtn.addEventListener("click", updateVehicleStatus);
        }

    } else if (currentPage === "bookingManager.jsp") {
        loadBookings();
        loadBookingStats();

        let searchInput = document.getElementById("searchInput");
        let filterStatus = document.getElementById("filterStatus");
        if (searchInput) searchInput.addEventListener("input", loadBookings);
        if (filterStatus) filterStatus.addEventListener("change", loadBookings);

    } else if (currentPage === "userManager.jsp") {
        loadUsersList();

        let updateUserForm = document.getElementById("updateUserForm");
        if (updateUserForm) {
            updateUserForm.addEventListener("submit", updateUserRole);
        }

        let closeModal = document.getElementById("closeModal");
        if (closeModal) {
            closeModal.addEventListener("click", closeUpdateModal);
        }

        let searchInput = document.getElementById("searchInput");
        let filterRole = document.getElementById("filterRole");
        if (searchInput) searchInput.addEventListener("input", filterUsers);
        if (filterRole) filterRole.addEventListener("change", filterUsers);

    } else if (currentPage === "adminProfile.jsp" || currentPage === "profile.jsp") {
        initAdminProfile();
    }
});



// ✅ Check if the user is logged in as an Admin
function checkAdminSession() {
    let userRole = sessionStorage.getItem("userRole");

    if (userRole !== "admin") {
        alert("Unauthorized Access! Redirecting to login...");
        window.location.href = "../login.jsp";
    }
}

// ✅ Set up navigation behavior (highlight active page)
function setupNavigation() {
    let navLinks = document.querySelectorAll("nav ul li a");
    let currentPath = window.location.pathname.split("/").pop(); // Get current filename

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active"); // Add active class for styling
        }
    });
}

// ✅ General function to filter any table dynamically
function filterTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.querySelector("table tbody"); // Selects the current table's body
    const rows = table.querySelectorAll("tr"); // Get all table rows

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

// ✅ Apply dynamic filtering on each key press
document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterTable);
    }
});

// ✅ Logout function (Clears session and redirects to login page)
function logout() {
    sessionStorage.clear();
    alert("Logging out...");
    window.location.href = "../login.jsp";
}
// ==============================================================================================================================
//                                                  🔹 API Links
// ==============================================================================================================================
const userApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/users";
const driverApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/drivers";
const categoryApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/categories";
const vehicleApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/vehicles";
const bookingApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/bookings";
const ratingsApiUrl = "http://localhost:8080/MegaCityCabsBackend/api/ratings";

// ==============================================================================================================================
//                                                  🔹 Driver Manager
// ==============================================================================================================================

// ✅ Load Users into the Dropdown
function loadUsers() {
    let userDropdown = document.getElementById("userId");
    if (!userDropdown) return;

    userDropdown.innerHTML = '<option value="">Loading...</option>';

    Promise.all([
        fetch(userApiUrl).then(response => response.json()),
        fetch(driverApiUrl).then(response => response.json())
    ])
    .then(([users, drivers]) => {
        userDropdown.innerHTML = '<option value="">Select Driver</option>';

        let assignedDriverIds = new Set(drivers.map(driver => driver.userId));

        let availableDrivers = users.filter(user =>
            user.uRole.toLowerCase() === "driver" && !assignedDriverIds.has(user.id)
        );

        if (availableDrivers.length === 0) {
            userDropdown.innerHTML = '<option value="">No available drivers</option>';
            return;
        }

        availableDrivers.forEach(driver => {
            userDropdown.innerHTML += `<option value="${driver.id}">${driver.fullName} (${driver.uEmail})</option>`;
        });
    })
    .catch(error => {
        console.error("Error fetching users or drivers:", error);
        userDropdown.innerHTML = '<option value="">Error loading drivers</option>';
    });
}

// ✅ Load Drivers into the Table
function loadDrivers() {
    Promise.all([
        fetch(driverApiUrl).then(response => response.json()),
        fetch(userApiUrl).then(response => response.json())
    ])
    .then(([drivers, users]) => {
        let driverTable = document.getElementById("driverTableBody");
        driverTable.innerHTML = ""; // Clear existing data

        if (drivers.length === 0) {
            driverTable.innerHTML = "<tr><td colspan='5'>No drivers found.</td></tr>";
            return;
        }

        // ✅ Create a lookup map for user names
        let userMap = {};
        users.forEach(user => userMap[user.id] = user.fullName);

        drivers.forEach(driver => {
            let userName = userMap[driver.userId] || "Unknown";
            let row = `<tr data-status="${driver.stat.toLowerCase()}">
                <td>${driver.id}</td>
                <td>${userName}</td>
                <td>${driver.dlNumber}</td> <!-- ✅ Fixed: Use dlNumber -->
                <td>${driver.stat}</td>
                <td>
                    <button class="edit-btn" onclick="openUpdateStatusModal(${driver.id}, '${userName}', '${driver.dlNumber}', '${driver.stat}')">Update</button>
                    <button class="delete-btn" onclick="deleteDriver(${driver.id})">Delete</button>
                </td>
            </tr>`;
            driverTable.innerHTML += row;
        });
    })
    .catch(error => console.error("❌ Error loading drivers:", error));
}


// ✅ Add a new driver
function addDriver(event) {
    event.preventDefault();

    let userId = document.getElementById("userId").value;
    let dlNumber = document.getElementById("dlNumber").value.trim();
    let status = document.getElementById("status").value;
    let errorMessage = document.getElementById("error-message");

    errorMessage.innerHTML = ""; // Clear previous errors

    if (!userId || !dlNumber) {
        errorMessage.innerHTML = "All fields are required.";
        return;
    }

    let driverData = {
        userId: userId,
        dlNumber: dlNumber,
        stat: status
    };

    fetch(`${driverApiUrl}/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(driverData)
    })
            .then(response => {
                if (!response.ok)
                    throw new Error("Failed to add driver.");
                return response.json();
            })
            .then(() => {
                alert("Driver added successfully!");
                loadDrivers(); // ✅ Refresh driver list
                loadUsers(); // ✅ Refresh dropdown list
            })
            .catch(error => {
                errorMessage.innerHTML = error.message;
            });
}

// ✅ Edit driver details (To be implemented later)
function editDriver(driverId) {
    alert("Edit functionality for driver ID " + driverId + " will be implemented soon.");
}
function updateDriverStatus(event) {
    event.preventDefault();

    let driverId = document.getElementById("updateDriverId").value;
    let newStatus = document.getElementById("updateDriverStatus").value;

    fetch(`${driverApiUrl}/${driverId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" }, // ✅ Send plain text instead of JSON
        body: newStatus // ✅ Send raw "Inactive" or "Active"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || "Failed to update driver status"); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "Driver status updated successfully!");
        closeUpdateStatusModal();
        loadDrivers(); // ✅ Refresh the driver table
    })
    .catch(error => {
        console.error("Error updating driver status:", error);
        alert("❌ Error: Driver status update failed.");
    });
}


// ✅ Open the Modal for Updating Driver Status
// ✅ Open the Modal for Updating Driver Status
function openUpdateStatusModal(driverId, userName, dlNumber, currentStatus) {
    let modal = document.getElementById("updateDriverModal");
    let idField = document.getElementById("updateDriverId");
    let nameField = document.getElementById("updateDriverName");
    let dlField = document.getElementById("updateDriverDL");
    let statusField = document.getElementById("updateDriverStatus");

    // Check if modal elements exist before modifying them
    if (!modal || !idField || !nameField || !dlField || !statusField) {
        console.error("❌ Error: One or more modal elements not found.");
        return;
    }

    idField.value = driverId;
    nameField.textContent = userName;
    dlField.textContent = dlNumber;
    statusField.value = currentStatus;

    modal.style.display = "block"; // ✅ Show modal
}


// ✅ Close the Modal
function closeUpdateStatusModal() {
    document.getElementById("updateDriverModal").style.display = "none"; // ✅ Hide modal
}

// ✅ Ensure modal closes if user clicks outside of it
window.onclick = function (event) {
    let modal = document.getElementById("updateDriverModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
function deleteDriver(driverId) {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    fetch(`${driverApiUrl}/${driverId}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete driver.");
            alert("Driver deleted successfully.");
            loadDrivers(); // ✅ Refresh driver list
        })
        .catch(error => console.error("❌ Error deleting driver:", error));
}
// ✅ Filter & Search Drivers
function filterDrivers() {
    let selectedStatus = document.getElementById("filterStatus").value.toLowerCase();
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let driverTable = document.getElementById("driverTableBody");

    if (!driverTable) {
        console.error("❌ Driver table body not found.");
        return;
    }

    let rows = driverTable.querySelectorAll("tr");
    rows.forEach(row => {
        let driverStatus = row.getAttribute("data-status") ? row.getAttribute("data-status").toLowerCase() : "";
        let textContent = row.innerText.toLowerCase();

        // ✅ Apply filtering: Match status & search term
        let statusMatch = (selectedStatus === "all" || driverStatus === selectedStatus);
        let searchMatch = (searchInput === "" || textContent.includes(searchInput));

        row.style.display = (statusMatch && searchMatch) ? "" : "none";
    });
}
// ==============================================================================================================================
//                                                  🔹 Category Manager
// ==============================================================================================================================

// ✅ Load Categories into the Table
function loadCategories() {
    fetch(categoryApiUrl)
        .then(response => response.json())
        .then(categories => {
            let categoryTable = document.getElementById("categoryTableBody");
            categoryTable.innerHTML = ""; // Clear existing data

            if (categories.length === 0) {
                categoryTable.innerHTML = "<tr><td colspan='9'>No categories found.</td></tr>";
                return;
            }

            categories.forEach(category => {
                let row = `<tr data-status="${category.stat.toLowerCase()}">
                    <td>${category.id}</td>
                    <td>${category.catName}</td>
                    <td>${category.maxPassengers}</td>
                    <td>${category.perKm}</td>
                    <td>${category.perHr}</td>
                    <td>${category.perDayPrice}</td>
                    <td>${category.perDayKm}</td>
                    <td>${category.stat}</td>
                    <td>
                        <button class="edit-btn" onclick="openUpdateCategoryModal(${category.id}, '${category.catName}', ${category.maxPassengers}, ${category.perKm}, ${category.perHr}, ${category.perDayPrice}, ${category.perDayKm}, '${category.stat}')">Edit</button>
                        <button class="delete-btn" onclick="confirmDeleteCategory(${category.id}, '${category.catName}')">Delete</button>
                    </td>
                </tr>`;
                categoryTable.innerHTML += row;
            });
        })
        .catch(error => console.error("❌ Error loading categories:", error));
}

// ✅ Open Update Category Modal
function openUpdateCategoryModal(id, catName, maxPassengers, perKm, perHr, perDayPrice, perDayKm, stat) {
    document.getElementById("updateCategoryId").value = id;
    document.getElementById("updateCatName").value = catName;
    document.getElementById("updateMaxPassengers").value = maxPassengers;
    document.getElementById("updatePerKm").value = perKm;
    document.getElementById("updatePerHr").value = perHr;
    document.getElementById("updatePerDayPrice").value = perDayPrice;
    document.getElementById("updatePerDayKm").value = perDayKm;
    document.getElementById("updateCategoryStatus").value = stat;

    document.getElementById("updateCategoryModal").style.display = "block"; // Show modal
}

// ✅ Close Modal
function closeUpdateCategoryModal() {
    document.getElementById("updateCategoryModal").style.display = "none";
}
// ✅ Update Category in Database
function updateCategory(event) {
    event.preventDefault();

    let categoryId = document.getElementById("updateCategoryId").value;
    let categoryData = {
        catName: document.getElementById("updateCatName").value.trim(),
        maxPassengers: document.getElementById("updateMaxPassengers").value,
        perKm: document.getElementById("updatePerKm").value,
        perHr: document.getElementById("updatePerHr").value,
        perDayPrice: document.getElementById("updatePerDayPrice").value,
        perDayKm: document.getElementById("updatePerDayKm").value,
        stat: document.getElementById("updateCategoryStatus").value
    };

    fetch(`${categoryApiUrl}/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || "Failed to update category"); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "Category updated successfully!");
        closeUpdateCategoryModal();
        loadCategories(); // Refresh the table
    })
    .catch(error => {
        console.error("Error updating category:", error);
        alert("❌ Error: Category update failed.");
    });
}

// ✅ Attach Event Listener
document.addEventListener("DOMContentLoaded", function () {
    let updateCategoryBtn = document.getElementById("confirmUpdateCategoryBtn");
    if (updateCategoryBtn) {
        updateCategoryBtn.addEventListener("click", updateCategory);
    }
});

// ✅ Filter & Search Categories
function filterCategories() {
    let selectedStatus = document.getElementById("filterStatus").value.toLowerCase();
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let categoryTable = document.getElementById("categoryTableBody");

    if (!categoryTable) {
        console.error("❌ Category table body not found.");
        return;
    }

    let rows = categoryTable.querySelectorAll("tr");
    rows.forEach(row => {
        let categoryStatus = row.getAttribute("data-status").toLowerCase();
        let textContent = row.innerText.toLowerCase(); // Get row content

        // ✅ Apply filtering: Match status & search term
        let statusMatch = (selectedStatus === "all" || categoryStatus === selectedStatus);
        let searchMatch = (searchInput === "" || textContent.includes(searchInput));

        // ✅ Show/Hide row based on filtering
        row.style.display = (statusMatch && searchMatch) ? "" : "none";
    });
}


// ✅ Add a new category
function addCategory(event) {
    event.preventDefault();

    let categoryData = {
        catName: document.getElementById("catName").value.trim(),
        maxPassengers: document.getElementById("maxPassengers").value,
        perKm: document.getElementById("perKm").value,
        perHr: document.getElementById("perHr").value,
        perDayPrice: document.getElementById("perDayPrice").value,
        perDayKm: document.getElementById("perDayKm").value,
        stat: document.getElementById("status").value
    };

    fetch(`${categoryApiUrl}/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(categoryData)
    })
            .then(response => response.json())
            .then(() => {
                alert("Category added successfully!");
                document.getElementById("categoryForm").reset();
                loadCategories(); // Refresh table
            })
            .catch(error => console.error("Error adding category:", error));
}
let categoryForm = document.querySelector("#categoryForm");
// ✅ Delete Category Function
function deleteCategory(categoryId) {
    fetch(`${categoryApiUrl}/${categoryId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || "Failed to delete category"); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "Category deleted successfully!");
        closeDeleteModal();
        loadCategories(); // ✅ Refresh category list
    })
    .catch(error => {
        console.error("❌ Error deleting category:", error);
        alert("❌ Error: Category cannot be deleted. It may have associated vehicles.");
    });
}
// ✅ Open Delete Confirmation Modal
function confirmDeleteCategory(categoryId, categoryName) {
    document.getElementById("deleteCategoryName").textContent = categoryName;
    document.getElementById("confirmDeleteBtn").setAttribute("onclick", `deleteCategory(${categoryId})`);
    document.getElementById("deleteModal").style.display = "block";
}

// ✅ Close Delete Confirmation Modal
function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}


// ==============================================================================================================================
//                                                  🔹 Vehicle Manager
// ==============================================================================================================================

function loadVehicles() {
    Promise.all([
        fetch(vehicleApiUrl).then(response => response.json()),
        fetch(categoryApiUrl).then(response => response.json())
    ])
    .then(([vehicles, categories]) => {
        let vehicleTable = document.getElementById("vehicleTableBody");
        vehicleTable.innerHTML = ""; // Clear existing data

        if (vehicles.length === 0) {
            vehicleTable.innerHTML = "<tr><td colspan='5'>No vehicles found.</td></tr>";
            return;
        }

        // ✅ Create category lookup map
        let categoryMap = {};
        categories.forEach(category => categoryMap[category.id] = category.catName);

        vehicles.forEach(vehicle => {
            let categoryName = categoryMap[vehicle.catId] || "Unknown Category";

            let row = `<tr data-status="${vehicle.stat.toLowerCase()}" data-category="${vehicle.catId}">
                <td>${vehicle.id}</td>
                <td>${categoryName}</td>  
                <td>${vehicle.vehiNumber}</td>
                <td>${vehicle.stat}</td>
                <td>
                    <button class="edit-btn" onclick="openUpdateVehicleModal(${vehicle.id}, '${vehicle.vehiNumber}', '${vehicle.stat}')">Update</button>
                    <button class="delete-btn" onclick="deleteVehicle(${vehicle.id})">Delete</button>
                </td>
            </tr>`;
            vehicleTable.innerHTML += row;
        });
    })
    .catch(error => console.error("❌ Error loading vehicles:", error));
}

// ✅ Open the Update Vehicle Status Modal
// ✅ Open Update Vehicle Status Modal
function openUpdateVehicleModal(vehicleId, vehicleNumber, currentStatus) {
    document.getElementById("updateVehicleId").textContent = vehicleId; // ✅ Set vehicle ID correctly
    document.getElementById("updateVehicleStatus").value = currentStatus; // ✅ Set the current status

    document.getElementById("updateVehicleModal").style.display = "block"; // ✅ Show modal
}



// ✅ Close the Update Vehicle Status Modal
function closeUpdateVehicleModal() {
    document.getElementById("updateVehicleModal").style.display = "none"; // Hide modal
}
// ✅ Update Vehicle Status via API
function updateVehicleStatus(event) {
    event.preventDefault();

    let vehicleId = document.getElementById("updateVehicleId").textContent; // Ensure we get the correct ID
    let newStatus = document.getElementById("updateVehicleStatus").value;

    if (!vehicleId || vehicleId === "-") {
        alert("❌ Error: Vehicle ID is missing.");
        return;
    }

    fetch(`${vehicleApiUrl}/${vehicleId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" }, // ✅ Matches @Consumes(MediaType.TEXT_PLAIN)
        body: newStatus // ✅ Send plain text, not JSON
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || "Failed to update vehicle status"); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "Vehicle status updated successfully!");
        closeUpdateVehicleModal();
        loadVehicles(); // ✅ Refresh the vehicle table
    })
    .catch(error => {
        console.error("Error updating vehicle status:", error);
        alert("❌ Error: Vehicle status update failed.");
    });
}

function filterVehicles() {
    let selectedStatus = document.getElementById("filterStatus").value.toLowerCase();
    let selectedCategory = document.getElementById("filterCategory").value;
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let vehicleTable = document.getElementById("vehicleTableBody");

    if (!vehicleTable) {
        console.error("❌ Vehicle table body not found.");
        return;
    }

    let rows = vehicleTable.querySelectorAll("tr");
    rows.forEach(row => {
        let vehicleStatus = row.getAttribute("data-status").toLowerCase();
        let vehicleCategory = row.getAttribute("data-category");
        let textContent = row.innerText.toLowerCase(); // Get row content

        // ✅ Apply filtering: Match status, category & search term
        let statusMatch = (selectedStatus === "all" || vehicleStatus === selectedStatus);
        let categoryMatch = (selectedCategory === "all" || vehicleCategory === selectedCategory);
        let searchMatch = (searchInput === "" || textContent.includes(searchInput));

        // ✅ Show/Hide row based on filtering
        row.style.display = (statusMatch && categoryMatch && searchMatch) ? "" : "none";
    });
}

// ✅ Load categories into the filter dropdown
function loadCategoriesForFilter() {
    fetch(categoryApiUrl)
            .then(response => response.json())
            .then(categories => {
                let categoryFilterDropdown = document.getElementById("filterCategory");
                categoryFilterDropdown.innerHTML = '<option value="all">All Categories</option>'; // Default option

                categories.forEach(category => {
                    categoryFilterDropdown.innerHTML += `<option value="${category.id}">${category.catName}</option>`;
                });
            })
            .catch(error => console.error("❌ Error loading categories for filter:", error));
}

// ✅ Call the function when page loads
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("vehicleManager.jsp")) {
        loadCategoriesForFilter();
    }
});


// ✅ Load category options for vehicle selection
function loadCategoriesForVehicles() {
    fetch(categoryApiUrl)
            .then(response => response.json())
            .then(categories => {
                let categoryDropdown = document.getElementById("category");
                categoryDropdown.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown

                categories.forEach(category => {
                    categoryDropdown.innerHTML += `<option value="${category.id}">${category.catName}</option>`;
                });
            })
            .catch(error => console.error("Error loading categories:", error));
}

// ✅ Add a new vehicle
function addVehicle(event) {
    event.preventDefault();

    let vehicleData = {
        catId: document.getElementById("category").value,
        vehiNumber: document.getElementById("vehiNumber").value.trim(),
        stat: document.getElementById("status").value
    };

    fetch(`${vehicleApiUrl}/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(vehicleData)
    })
            .then(response => response.json())
            .then(() => {
                alert("Vehicle added successfully!");
                document.getElementById("vehicleForm").reset();
                loadVehicles(); // Refresh table
            })
            .catch(error => console.error("Error adding vehicle:", error));
}

// ✅ Edit vehicle details (To be implemented later)
function editVehicle(vehicleId) {
    alert("Edit functionality for vehicle ID " + vehicleId + " will be implemented soon.");
}

// ✅ Delete a vehicle
function deleteVehicle(vehicleId) {
    if (confirm("Are you sure you want to delete this vehicle?")) {
        fetch(`${vehicleApiUrl}/${vehicleId}`, {
            method: "DELETE"
        })
                .then(response => response.json())
                .then(() => {
                    alert("Vehicle deleted successfully.");
                    loadVehicles(); // Refresh list
                })
                .catch(error => console.error("Error deleting vehicle:", error));
    }
}

let vehicleForm = document.getElementById("vehicleForm");
if (vehicleForm) {
    vehicleForm.addEventListener("submit", addVehicle);
}

// ==============================================================================================================================
//                                                  🔹 Booking Manager
// ==============================================================================================================================
// ✅ Load all bookings, replace IDs with actual names, and apply filters
function loadBookings() {
    // Fetch all data in parallel
    Promise.all([
        fetch(bookingApiUrl).then(response => response.json()),  // Fetch bookings
        fetch(userApiUrl).then(response => response.json()),     // Fetch users
        fetch(vehicleApiUrl).then(response => response.json()),  // Fetch vehicles
        fetch(driverApiUrl).then(response => response.json()),   // Fetch drivers
        fetch(categoryApiUrl).then(response => response.json()), // Fetch categories
        fetch(ratingsApiUrl).then(response => response.json())   // Fetch ratings
    ])
    .then(([bookings, users, vehicles, drivers, categories, ratings]) => {
        let bookingTable = document.getElementById("bookingTableBody");
        if (!bookingTable) return;
        bookingTable.innerHTML = ""; // Clear existing data

        if (bookings.length === 0) {
            bookingTable.innerHTML = "<tr><td colspan='12'>No bookings found.</td></tr>";
            return;
        }

        // Convert fetched arrays into lookup objects for fast access
        let userMap = {}, vehicleMap = {}, driverMap = {}, categoryMap = {}, ratingMap = {};

        users.forEach(user => userMap[user.id] = user.fullName);  // User ID → Full Name
        categories.forEach(cat => categoryMap[cat.id] = cat.catName);  // Category ID → Name
        vehicles.forEach(vehicle => vehicleMap[vehicle.id] = vehicle.catId);  // Vehicle ID → Category ID
        drivers.forEach(driver => driverMap[driver.id] = driver.userId);  // Driver ID → User ID
        ratings.forEach(rating => ratingMap[rating.bookingId] = rating);  // Booking ID → Rating & Comment

        // ✅ Get filter values
        let selectedStatus = document.getElementById("filterStatus").value.toLowerCase();
        let searchQuery = document.getElementById("searchInput").value.toLowerCase();

        // ✅ Populate table with filtering applied
        bookings.forEach(booking => {
            let userName = userMap[booking.userId] || "Unknown";
            let categoryId = vehicleMap[booking.vehicleId] || null;
            let categoryName = categoryId ? categoryMap[categoryId] : "Unknown";
            let driverUserId = driverMap[booking.driverId] || null;
            let driverName = driverUserId ? userMap[driverUserId] : "Unknown";

            let bookingStatus = booking.stat.toLowerCase();
            let statusClass = bookingStatus === "pending" ? "status-pending" :
                              bookingStatus === "confirmed" ? "status-confirmed" :
                              bookingStatus === "in progress" ? "status-in-progress" :
                              bookingStatus === "completed" ? "status-completed" :
                              "status-cancelled";

            // ✅ Get rating details
            let ratingInfo = ratingMap[booking.id];
            let ratingDisplay = ratingInfo 
                ? `<a href="#" onclick="viewRating(${booking.id}, '${ratingInfo.rating}', '${ratingInfo.comment}')">${ratingInfo.rating} ⭐</a>`
                : `<span class="no-rating">No Rating</span>`;

            // ✅ Searchable content
            let searchContent = `${userName} ${categoryName} ${driverName} ${booking.pickupLocation} ${booking.destination}`.toLowerCase();
            
            // ✅ Apply filtering (Status + Search Query)
            if ((selectedStatus === "all" || bookingStatus === selectedStatus) &&
                (searchQuery === "" || searchContent.includes(searchQuery))) {
                
                let row = `<tr>
                    <td>${booking.id}</td>
                    <td>${userName}</td>
                    <td>${categoryName}</td>
                    <td>${driverName}</td>
                    <td>${booking.pickupLocation}</td>
                    <td>${booking.destination}</td>
                    <td>${new Date(booking.startDate).toLocaleDateString()}</td>
                    <td>${new Date(booking.endDate).toLocaleDateString()}</td>
                    <td>${booking.pickupTime}</td>
                    <td>Rs${booking.finalPrice.toFixed(2)}</td>
                    <td class="${statusClass}">${booking.stat}</td>
                    <td>${ratingDisplay}</td>
                </tr>`;
                bookingTable.innerHTML += row;
            }
        });

        // If no matching results
        if (bookingTable.innerHTML === "") {
            bookingTable.innerHTML = "<tr><td colspan='12'>No matching bookings found.</td></tr>";
        }
    })
    .catch(error => console.error("Error loading bookings:", error));
}
function viewRating(bookingId, rating, comment) {
    alert(`Booking ID: ${bookingId}\nRating: ${rating} ⭐\nComment: ${comment}`);
}


// ✅ Load booking stats and update dashboard cards
function loadBookingStats() {
    fetch(bookingApiUrl)
        .then(response => response.json())
        .then(bookings => {
            if (!bookings || bookings.length === 0) {
                console.warn("⚠ No bookings found.");
                return;
            }

            let totalBookings = bookings.length;
            let activeBookings = bookings.filter(b => b.stat.toLowerCase() === "in progress").length;
            let completedBookings = bookings.filter(b => b.stat.toLowerCase() === "completed").length;
            let pendingBookings = bookings.filter(b => b.stat.toLowerCase() === "pending").length;

            // ✅ Check if elements exist before updating
            let totalElem = document.getElementById("totalBookings");
            let activeElem = document.getElementById("activeBookings");
            let completedElem = document.getElementById("completedBookings");
            let pendingElem = document.getElementById("pendingBookings");

            if (totalElem) totalElem.textContent = totalBookings;
            if (activeElem) activeElem.textContent = activeBookings;
            if (completedElem) completedElem.textContent = completedBookings;
            if (pendingElem) pendingElem.textContent = pendingBookings;
        })
        .catch(error => console.error("Error loading booking stats:", error));
}

// ✅ Call function after ensuring DOM is loaded
document.addEventListener("DOMContentLoaded", loadBookingStats);


// ✅ Run when page loads
document.addEventListener("DOMContentLoaded", function () {
    loadBookingStats();
});


// ✅ Filter & Search Bookings
function filterBookings() {
    let selectedStatus = document.getElementById("filterStatus").value.toLowerCase();
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let bookingTable = document.getElementById("bookingTableBody");

    if (!bookingTable) {
        console.error("❌ Booking table body not found.");
        return;
    }

    let rows = bookingTable.querySelectorAll("tr");
    rows.forEach(row => {
        let bookingStatus = row.getAttribute("data-status").toLowerCase();
        let textContent = row.innerText.toLowerCase(); // Get row content

        // ✅ Apply filtering: Match status & search term
        let statusMatch = (selectedStatus === "all" || bookingStatus === selectedStatus);
        let searchMatch = (searchInput === "" || textContent.includes(searchInput));

        // ✅ Show/Hide row based on filtering
        row.style.display = (statusMatch && searchMatch) ? "" : "none";
    });
}


// ==============================================================================================================================
//                                                  🔹 User Manager
// ==============================================================================================================================
// ✅ Load Users into the Table
function loadUsersList() {
    fetch(userApiUrl)
        .then(response => response.json())
        .then(users => {
            let userTable = document.getElementById("userTableBody");
            userTable.innerHTML = ""; // Clear existing data

            if (users.length === 0) {
                userTable.innerHTML = "<tr><td colspan='8'>No users found.</td></tr>";
                return;
            }

            users.forEach(user => {
                let row = `<tr data-role="${user.uRole.toLowerCase()}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.uRole}</td>
                    <td>${user.fullName}</td>
                    <td>${user.uEmail}</td>
                    <td>${user.nic}</td>
                    <td>${user.address}</td>
                    <td>${user.phone}</td>
                    <td>
                        <button class="edit-btn" onclick="openUpdateModal(${user.id}, '${user.fullName}', '${user.uRole}', '${user.uEmail}')">Update</button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>`;
                userTable.innerHTML += row;
            });
        })
        .catch(error => console.error("❌ Error loading users:", error));
}


// ✅ Open Update Role Modal
function openUpdateModal(userId, fullName, currentRole, email) {
    document.getElementById("updateUserId").value = userId;
    document.getElementById("updateUserName").textContent = fullName;
    document.getElementById("updateUserEmail").textContent = email;
    document.getElementById("updateUserRole").value = currentRole;

    document.getElementById("updateUserModal").style.display = "block"; // ✅ Show modal
}


// ✅ Close the Update Role Modal
function closeUpdateModal() {
    document.getElementById("updateUserModal").style.display = "none"; // ✅ Hide modal
}


// ✅ Ensure modal closes if user clicks outside of it
window.onclick = function (event) {
    let modal = document.getElementById("updateUserModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function updateUserRole(event) {
    event.preventDefault();

    let userId = document.getElementById("updateUserId").value;
    let newRole = document.getElementById("updateUserRole").value;

    fetch(`${userApiUrl}/${userId}/updateRole/${newRole}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || "Failed to update user role"); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "User role updated successfully!");
        closeUpdateModal();
        loadUsersList(); // ✅ Refresh user table
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert("❌ Error: User update failed.");
    });
}

// ✅ Delete User Function
function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?"))
        return;

    fetch(`${userApiUrl}/${userId}`, {method: "DELETE"})
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || "Failed to delete user");
                });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || "User deleted successfully.");
            loadUsersList(); // ✅ Refresh user table
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("❌ Error: User cannot be deleted. They might have related records (drivers/bookings).");
        });
}

// ✅ Filter Users by Role & Search
function filterUsers() {
    let selectedRole = document.getElementById("filterRole").value.toLowerCase();
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let userTable = document.getElementById("userTableBody");

    if (!userTable) {
        console.error("❌ User table body not found.");
        return;
    }

    let rows = userTable.querySelectorAll("tr");
    rows.forEach(row => {
        let userRole = row.getAttribute("data-role").toLowerCase(); // Extract role from data attribute
        let textContent = row.innerText.toLowerCase(); // Get row content

        // ✅ Apply filtering: Match role & search term
        let roleMatch = (selectedRole === "all" || userRole === selectedRole);
        let searchMatch = (searchInput === "" || textContent.includes(searchInput));

        // ✅ Show/Hide row based on filtering
        row.style.display = (roleMatch && searchMatch) ? "" : "none";
    });
}



// ==============================================================================================================================
//                                                  🔹 Admin Profile Management
// ==============================================================================================================================

// Helper function to get elements
function getElement(id) {
    return document.getElementById(id);
}

// ✅ Load Admin Profile
function loadAdminProfile() {
    let userId = sessionStorage.getItem("userId");

    if (!userId) {
        showAlert("⚠️ User not found. Please log in again.", "error");
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
                // ✅ Set user data to form fields
                getElement("fullName").value = user.fullName || "N/A";
                getElement("username").value = user.username || "N/A";
                getElement("uRole").value = user.uRole || "N/A";
                getElement("nic").value = user.nic || "N/A";
                getElement("email").value = user.uEmail || "";
                getElement("phone").value = user.phone || "";
                getElement("address").value = user.address || "";

                // ✅ Update the profile header information
                getElement("profileFullName").textContent = user.fullName || "Admin";
                getElement("profileRole").textContent = user.uRole || "Administrator";

                // ✅ Set user initials in avatar
                if (user.fullName) {
                    const initials = user.fullName.split(' ')
                            .map(name => name.charAt(0))
                            .join('')
                            .toUpperCase();

                    getElement("profileInitials").textContent = initials;
                    getElement("userInitials").textContent = initials;
                }

                // ✅ Set admin name in header
                getElement("adminName").textContent = user.fullName || "Admin";
            })
            .catch(error => {
                console.error("❌ Error loading profile:", error);
                showAlert("⚠️ An error occurred while loading your profile.", "error");
            });
}

// ✅ Update Profile
function updateProfile(event) {
    event.preventDefault();

    let userId = sessionStorage.getItem("userId");
    if (!userId) {
        showAlert("⚠️ User not found. Please log in again.", "error");
        window.location.href = "../login.jsp";
        return;
    }

    // ✅ Get all form values
    let fullName = getElement("fullName").value.trim();
    let username = getElement("username").value.trim();
    let uRole = getElement("uRole").value.trim();
    let nic = getElement("nic").value.trim();
    let email = getElement("email").value.trim();
    let phone = getElement("phone").value.trim();
    let address = getElement("address").value.trim();

    if (!email || !phone || !address) {
        showAlert("⚠️ Please fill out all required fields.", "warning");
        return;
    }

    // ✅ Disable button to prevent multiple submissions
    const updateButton = getElement("updateProfileForm").querySelector("button");
    updateButton.disabled = true;
    const originalBtnText = updateButton.innerHTML;
    updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

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
                    showAlert("❌ This email is already used by another account. Please choose another.", "error");
                    updateButton.disabled = false;
                    updateButton.innerHTML = originalBtnText;
                    return;
                }

                // ✅ If email is unique, prepare user data for the API
                let userData = {
                    id: parseInt(userId),
                    fullName: fullName,
                    username: username,
                    uRole: uRole,
                    nic: nic,
                    uEmail: email,
                    phone: phone,
                    address: address
                };

                return fetch(`${userApiUrl}/${userId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(userData)
                });
            })
            .then(response => {
                if (!response || !response.ok) {
                    throw new Error("⚠️ Failed to update profile.");
                }
                return response.json();
            })
            .then(data => {
                showAlert("✅ Profile updated successfully!", "success");
                loadAdminProfile(); // Refresh profile data after update
            })
            .catch(error => {
                console.error("❌ Error updating profile:", error);
                showAlert("⚠️ An error occurred while updating your profile. Please try again.", "error");
            })
            .finally(() => {
                updateButton.disabled = false;
                updateButton.innerHTML = originalBtnText;
            });
}

// ✅ Change Password
function changePassword(event) {
    event.preventDefault();

    let userId = sessionStorage.getItem("userId");
    let currentPassword = getElement("currentPassword").value;
    let newPassword = getElement("newPassword").value;
    let confirmPassword = getElement("confirmPassword").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert("⚠️ All password fields are required.", "warning");
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert("❌ New passwords do not match.", "error");
        return;
    }

    // ✅ Disable button to prevent multiple submissions
    const changePasswordBtn = getElement("changePasswordForm").querySelector("button");
    changePasswordBtn.disabled = true;
    const originalBtnText = changePasswordBtn.innerHTML;
    changePasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    let passwordData = {currentPassword: currentPassword, newPassword: newPassword};

    fetch(`${userApiUrl}/${userId}/change-password`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
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
                showAlert("✅ Password changed successfully.", "success");
                getElement("changePasswordForm").reset(); // Clear the form

                // Reset password strength indicator
                const strengthBar = document.querySelector('.strength-bar');
                const strengthText = document.querySelector('.strength-text');
                if (strengthBar && strengthText) {
                    strengthBar.style.width = "0%";
                    strengthText.textContent = "";
                }
            })
            .catch(error => {
                console.error("❌ Error changing password:", error);
                showAlert(error.message || "⚠️ An error occurred. Please try again.", "error");
            })
            .finally(() => {
                changePasswordBtn.disabled = false;
                changePasswordBtn.innerHTML = originalBtnText;
            });
}

// ✅ Show Alert Message
function showAlert(message, type = "info") {
    const flashMessage = getElement("flashMessage");
    const flashMessageText = getElement("flashMessageText");

    if (!flashMessage || !flashMessageText)
        return;

    // Clear existing classes
    flashMessage.className = "alert";

    // Add type class
    flashMessage.classList.add(type);

    // Set message
    flashMessageText.textContent = message;

    // Show the alert
    flashMessage.style.display = "flex";

    // Auto-hide after 5 seconds
    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 5000);
}

// ✅ Close Alert
function closeAlert(button) {
    const alert = button.closest('.alert');
    if (alert) {
        alert.style.display = "none";
    }
}

// ✅ Password Strength Checker
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (!strengthBar || !strengthText)
        return;

    // Reset
    strengthBar.style.width = "0%";
    strengthText.textContent = "";

    if (!password)
        return;

    // Calculate strength
    let strength = 0;

    // Length check
    if (password.length >= 8)
        strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(password))
        strength += 25;

    // Contains uppercase
    if (/[A-Z]/.test(password))
        strength += 25;

    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password))
        strength += 25;

    // Update UI
    strengthBar.style.width = `${strength}%`;

    // Set text based on strength
    if (strength <= 25) {
        strengthText.textContent = "Weak";
    } else if (strength <= 50) {
        strengthText.textContent = "Fair";
    } else if (strength <= 75) {
        strengthText.textContent = "Good";
    } else {
        strengthText.textContent = "Strong";
    }
}

// ✅ Initialize all event listeners
function initAdminProfile() {
    // Load profile data
    loadAdminProfile();

    // Form submissions
    const updateProfileForm = getElement("updateProfileForm");
    if (updateProfileForm) {
        updateProfileForm.addEventListener("submit", updateProfile);
    }

    const changePasswordForm = getElement("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", changePassword);
    }

    // Password strength checker
    const newPasswordInput = getElement("newPassword");
    if (newPasswordInput) {
        newPasswordInput.addEventListener("input", function () {
            checkPasswordStrength(this.value);
        });
    }

    // Logout handlers
    const logoutBtn = getElement("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    const headerLogoutBtn = getElement("headerLogoutBtn");
    if (headerLogoutBtn) {
        headerLogoutBtn.addEventListener("click", logout);
    }

    // Security toggle handlers
    const twoFactorToggle = getElement("twoFactorToggle");
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener("change", function () {
            // This would call your API to update the setting
            const enabled = this.checked;
            showAlert(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`, "info");
        });
    }
}

