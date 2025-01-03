// פונקציה להצגת טופס ההרשמה
function showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// פונקציה להצגת טופס ההתחברות
function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// פונקציה לרישום משתמשים
function registerUser(event) {
    event.preventDefault();

    const username = document.querySelector("#signup-form input[placeholder='Username']").value;
    const email = document.querySelector("#signup-form input[placeholder='Email']").value;
    const password = document.querySelector("#signup-form input[placeholder='Password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (users[username]) {
        alert("Username already exists. Please choose a different one.");
        return;
    }

    users[username] = password;
    userData[username] = {
        email: email,
        lastLogin: null,  // זה ישתנה כאשר יתחבר שוב
        totalTime: 0
    };

    // עדכון ה lastLogin בפורמט קריא
    const currentDate = new Date();
    userData[username].lastLogin = currentDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Registration successful! You can now log in.");
    showLoginForm();
}

// פונקציה להתחברות משתמשים
function loginUser(event) {
    event.preventDefault();

    const usernameOrEmail = document.querySelector("#login-form input[placeholder='Username or Email']").value;
    const password = document.querySelector("#login-form input[placeholder='Password']").value;
    const messageElement = document.getElementById("login-message");

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const failedAttempts = JSON.parse(localStorage.getItem("failedAttempts")) || {};

    const lockDuration = 2 * 60 * 1000; // 2 דקות במילישניות
    const now = Date.now();

    messageElement.innerHTML = "";

    const username = Object.keys(users).find((user) =>
        user === usernameOrEmail ||
        (userData[user] && userData[user].email === usernameOrEmail)
    );

    if (!username) {
        messageElement.innerHTML = "User does not exist. Please register first.";
        return;
    }

    if (failedAttempts[username] && failedAttempts[username].lockUntil > now) {
        const remainingTime = Math.ceil((failedAttempts[username].lockUntil - now) / 1000);
        messageElement.innerHTML = `Too many failed attempts. Please try again in ${remainingTime} seconds.`;
        return;
    }

    if (users[username] === password) {
        delete failedAttempts[username];
        localStorage.setItem("failedAttempts", JSON.stringify(failedAttempts));

        userData[username].lastLogin = new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        localStorage.setItem("userData", JSON.stringify(userData));

        localStorage.setItem("currentUser", username);
        localStorage.setItem("currentSessionStart", Date.now());

        window.location.href = "../html/main.html";
    } else {
        if (!failedAttempts[username]) {
            failedAttempts[username] = { count: 0, lockUntil: 0 };
        }

        failedAttempts[username].count++;

        if (failedAttempts[username].count >= 3) {
            failedAttempts[username].lockUntil = now + lockDuration;
            failedAttempts[username].count = 0;
            messageElement.innerHTML = `Too many failed attempts. You are locked out for 2 minutes.`;
        } else {
            messageElement.innerHTML = `Incorrect username or password. ${3 - failedAttempts[username].count} attempts remaining.`;
        }

        localStorage.setItem("failedAttempts", JSON.stringify(failedAttempts));
    }
}
