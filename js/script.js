function showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

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
    userData[username] = { lastLogin: null, totalTime: 0 };
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userData", JSON.stringify(userData));

    localStorage.setItem("currentUser", username); // שומר את המשתמש הנוכחי
    localStorage.setItem("currentSessionStart", Date.now()); // שומר את זמן התחלת הסשן

    window.location.href = "../html/main.html";
}

function loginUser(event) {
    event.preventDefault();

    const username = document.querySelector("#login-form input[placeholder='Username or Email']").value;
    const password = document.querySelector("#login-form input[placeholder='Password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (!users[username]) {
        alert("Username does not exist. Please register first.");
        return;
    }

    if (users[username] === password) {
        const now = Date.now();
        localStorage.setItem("currentUser", username);
        localStorage.setItem("currentSessionStart", now);

        if (!userData[username]) {
            userData[username] = { lastLogin: now, totalTime: 0 };
        } else {
            userData[username].lastLogin = now;
        }

        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "../html/main.html";
    } else {
        alert("Incorrect password. Please try again.");
    }
}



