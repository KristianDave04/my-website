document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector(".signup form");
    const loginForm = document.querySelector(".login form");

    function showMessage(form, message, isSuccess = true) {
        const box = form.querySelector(".messageBox");
        box.textContent = message;
        box.style.display = "block";
        box.style.padding = "10px";
        box.style.marginTop = "10px";
        box.style.textAlign = "center";
        box.style.borderRadius = "5px";
        box.style.backgroundColor = isSuccess ? "#d4edda" : "#f8d7da";
        box.style.color = isSuccess ? "#155724" : "#721c24";
        box.style.border = isSuccess ? "1px solid #c3e6cb" : "1px solid #f5c6cb";

        setTimeout(() => {
            box.style.display = "none";
        }, 3000);
    }

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = signupForm.querySelector("input[name='txt']").value;
        const email = signupForm.querySelector("input[name='email']").value;
        const password = signupForm.querySelector("input[name='pswd']").value;

        const user = { username, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showMessage(signupForm, "Registration successful. You can now log in.", true);
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = loginForm.querySelector("input[name='email']").value;
        const password = loginForm.querySelector("input[name='pswd']").value;

        const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

        if (!storedUser) {
            showMessage(loginForm, "No registered user found. Please sign up first.", false);
        } else if (storedUser.email === email && storedUser.password === password) {
            showMessage(loginForm, "Login successful! Redirecting...", true);
            setTimeout(() => {
                window.location.href = "../InfoTech Academy/Dashboard/dashboard.html"; // Replace with your actual page
            }, 1500);
        } else {
            showMessage(loginForm, "Invalid credentials. Try again.", false);
        }
ss
        
    });
});
