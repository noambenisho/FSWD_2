// function to show the signup form 
function showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// function to show the login form
function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// function to register a new user and store their data in local storage
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
        lastLogin: null,
        totalTime: 0
    };

    const currentDate = new Date();
    userData[username].lastLogin = currentDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    localStorage.setItem("currentUser", username);
    localStorage.setItem("currentSessionStart", Date.now());

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userData", JSON.stringify(userData));

    // set a cookie to remember the username for 7 days
    document.cookie = `username=${username}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

    alert("Registration successful! You can now log in.");
    window.location.href = "../html/main.html";
}

// function to update the message displayed to the user
function updateMessage(messageElement, message) {
    messageElement.innerHTML = message;
    if (messageElement.style.display === "none") {
        messageElement.style.display = "block";
    }
}

// function to handle lockout of users after too many failed login attempts
function handleLockout(username, failedAttempts, messageElement) {
    const interval = setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.ceil((failedAttempts[username].lockUntil - now) / 1000);
        if (remainingTime > 0) {
            updateMessage(
                messageElement,
                `Too many failed attempts. Please try again in ${remainingTime} seconds.`
            );
        } else {
            failedAttempts[username].lockUntil = 0;
            localStorage.setItem("failedAttempts", JSON.stringify(failedAttempts));
            messageElement.innerHTML = "";
            messageElement.style.display = "none";
            clearInterval(interval);
        }
    }, 1000);
}

// function to log in users and handle failed login attempts
function loginUser(event) {
    event.preventDefault();

    const usernameOrEmail = document.querySelector("#login-form input[placeholder='Username or Email']").value;
    const password = document.querySelector("#login-form input[placeholder='Password']").value;
    const messageElement = document.getElementById("login-message");

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const failedAttempts = JSON.parse(localStorage.getItem("failedAttempts")) || {};

    const lockDuration = 2 * 60 * 1000; 
    const now = Date.now();

    messageElement.innerHTML = "";

    const username = Object.keys(users).find((user) =>
        user === usernameOrEmail ||
        (userData[user] && userData[user].email === usernameOrEmail)
    );

    if (!username) {
        updateMessage(messageElement, "User does not exist. Please register first.");
        return;
    }

    if (failedAttempts[username] && failedAttempts[username].lockUntil > now) {
        handleLockout(username, failedAttempts, messageElement);
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

        document.cookie = `username=${username}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

        window.location.href = "../html/main.html";
    } else {
        if (!failedAttempts[username]) {
            failedAttempts[username] = { count: 0, lockUntil: 0 };
        }

        if (failedAttempts[username].lockUntil === 0) {
            failedAttempts[username].count++;

            if (failedAttempts[username].count >= 3) {
                failedAttempts[username].lockUntil = now + lockDuration;
                failedAttempts[username].count = 0;
                updateMessage(
                    messageElement,
                    `Too many failed attempts. You are locked out for 2 minutes.`
                );
                handleLockout(username, failedAttempts, messageElement);
            } else {
                updateMessage(
                    messageElement,
                    `Incorrect username or password. ${3 - failedAttempts[username].count} attempts remaining.`
                );
            }
        }
        localStorage.setItem("failedAttempts", JSON.stringify(failedAttempts));
    }
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

function initializeLoginForm() {
    const usernameField = document.querySelector("#login-form input[placeholder='Username or Email']");
    const savedUsername = getCookie("username");
    if (savedUsername) {
        usernameField.value = savedUsername;
    }
}

document.addEventListener("DOMContentLoaded", initializeLoginForm);
