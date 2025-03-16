// ✅ Ensure session is cleared when reaching login page
window.onload = function () {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    clearSession(); // Clear session on page load
};

// ✅ Function to clear session storage
function clearSession() {
    sessionStorage.clear();
    localStorage.clear();
    console.log("🔹 Session cleared on login page load.");
}

// ✅ Login Form Submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    let errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.id = "error-message";
        errorMessage.classList.add("error");
        document.getElementById("loginForm").appendChild(errorMessage);
    }
    errorMessage.innerHTML = ""; // Clear previous errors

    // ✅ Basic validation
    if (!email || !password) {
        errorMessage.innerHTML = "Both fields are required.";
        return;
    }

    // ✅ Prepare login data
    let loginData = {
        uEmail: email,
        pWord: password
    };

    // ✅ Send login request
    fetch("http://localhost:8080/MegaCityCabsBackend/api/users/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error("Invalid email or password.");
        }
        if (!response.ok) {
            throw new Error("Login failed. Please try again.");
        }
        return response.json();
    })
    .then(user => {
        // ✅ Store user info in session storage
        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userRole", user.uRole);
        sessionStorage.setItem("userEmail", user.uEmail);

        // ✅ Redirect based on user role
        if (user.uRole === "admin") {
            window.location.href = "admin/adminDash.jsp";
        } else if (user.uRole === "user") {
            window.location.href = "customer/customerDash.jsp";
        } else if (user.uRole === "driver") {
            window.location.href = "driver/driverDash.jsp";
        } else {
            throw new Error("Unknown user role.");
        }
    })
    .catch(error => {
        errorMessage.innerHTML = error.message;
    });
});
