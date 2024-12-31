function showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function registerUser(event) {
    event.preventDefault(); // מניעת ריענון הדף
    
    const username = document.querySelector("#signup-form input[placeholder='Username']").value;
    const email = document.querySelector("#signup-form input[placeholder='Email']").value;
    const password = document.querySelector("#signup-form input[placeholder='Password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (users[username]) {
        alert("Username already exists. Please choose a different one.");
        return;
    }
    
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "../html/main.html";
}

function loginUser(event) {
    const username = document.querySelector("#login-form input[placeholder='Username or Email']").value;
    const password = document.querySelector("#login-form input[placeholder='Password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (!users[username]) {
        alert("Username does not exist. Please register first.");
        return;
    }
    
    if (users[username] === password) {
        alert("hi")
        window.location.href = "../html/main.html";+
        alert("bye")
    } else {
        alert("Incorrect password. Please try again.");
    }
}