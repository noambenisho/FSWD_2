// format time in HH:mm:ss format
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// update user info in the DOM
// function updateUserInfo() {
//     const username = localStorage.getItem("currentUser");
//     const userData = JSON.parse(localStorage.getItem("userData")) || {};

//     if (username && userData[username]) {
//         const totalTimeElement = document.getElementById("total-time");
//         const totalTimeInSeconds = userData[username].totalTime || 0;

//         totalTimeElement.textContent = formatTime(totalTimeInSeconds);
//     }
// }

// the logout button
document.getElementById("logout-icon").addEventListener("click", function () {
    calculateSessionDuration();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionStart");
    window.location.href = "../html/login.html";
});

// calculate session duration
function calculateSessionDuration() {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const sessionStart = parseInt(localStorage.getItem("currentSessionStart"));
    const now = Date.now();

    if (sessionStart && username) {
        const sessionDuration = Math.floor((now - sessionStart) / 1000); // calculate session duration in seconds
        const currentTotal = userData[username]?.totalTime || 0;
        const newTotal = currentTotal + sessionDuration;

        userData[username].totalTime = newTotal;
        localStorage.setItem("userData", JSON.stringify(userData));
    }
}

// update user info when the page loads
window.addEventListener("load", function () {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (username) {
        // update last login time
        if (!userData[username].lastLogin) {
            userData[username].lastLogin = new Date().toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            localStorage.setItem("userData", JSON.stringify(userData));
        }

        // update session start time
        localStorage.setItem("currentSessionStart", Date.now());

        // update user info in the DOM
        // updateUserInfo();
    }
});

function updateWelcomeAndScores() {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (username && userData[username]) {
        document.getElementById("welcome-message").textContent = `Hi ${username}!`;

        // clear previous high scores
        const highScoresDiv = document.getElementById("high-scores");
        highScoresDiv.innerHTML = "";

        // display games high scores
        displayHighScores(userData[username].snakeHighScores, "Snake game");
        displayHighScores(userData[username].game2048HighScores, "2048 game");
    }
}

function displayHighScores(scores, title) {
    if (scores && scores.length > 0) {
        scores.sort((a, b) => b - a);

        let tableHTML = `<table><thead><tr><th>${title}</th></tr></thead><tbody>`;
        const maxScoresToShow = 5;

        for (let i = 0; i < Math.min(scores.length, maxScoresToShow); i++) {
            tableHTML += `<tr><td>${scores[i]}</td></tr>`;
        }

        tableHTML += `</tbody></table>`;
        document.getElementById("high-scores").innerHTML += tableHTML;
    } else {
        document.getElementById("high-scores").innerHTML += `<p>Start playing ${title} to see your achievements here.</p>`;
    }
}

// update welcome message and high scores when the page loads
window.addEventListener("beforeunload", function () {
    calculateSessionDuration();
});
