document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    let username = document.getElementById("username").value.trim();
    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let nic = document.getElementById("nic").value.trim();
    let address = document.getElementById("address").value.trim();
    let phone = document.getElementById("phone").value.trim();

    let errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = ""; // Clear previous errors

    // Client-side validation
    if (username.length < 3) {
        errorMessage.innerHTML = "Username must be at least 3 characters.";
        return;
    }
    if (password.length < 6) {
        errorMessage.innerHTML = "Password must be at least 6 characters.";
        return;
    }
    if (!/^\d{9}[vV]?$/.test(nic)) {
        errorMessage.innerHTML = "Invalid NIC format. Use 9 digits + V/v (e.g., 957654321V) or 12 digits (e.g., 199576543210).";
        return;
    }
    if (!/^\d{10}$/.test(phone) && phone !== "") {
        errorMessage.innerHTML = "Invalid phone number format.";
        return;
    }

    // Prepare data for API request
    let userData = {
        username: username,
        pWord: password,
        uRole: "user", // Default role for new users
        fullName: fullName,
        uEmail: email,
        nic: nic,
        address: address,
        phone: phone
    };

    // Send data to backend
    fetch("http://localhost:8080/MegaCityCabsBackend/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.status === 409) {
            return response.json().then(data => { throw new Error(data.message); });
        }
        if (!response.ok) {
            throw new Error("Failed to register user.");
        }
        return response.json();
    })
    .then(data => {
        alert("Registration successful!");
        window.location.href = "login.jsp"; // Redirect to login page
    })
    .catch(error => {
        errorMessage.innerHTML = error.message;
    });
});
