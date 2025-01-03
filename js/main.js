// פונקציה לחישוב זמן בפורמט HH:mm:ss
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// פונקציה לעדכון המידע ב- DOM
function updateUserInfo() {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (username && userData[username]) {
        // הצגת זמן כולל בפורמט HH:mm:ss
        const totalTimeElement = document.getElementById("total-time");
        const totalTimeInSeconds = userData[username].totalTime || 0;
        totalTimeElement.textContent = `Total Time: ${formatTime(totalTimeInSeconds)}`;

        // הצגת התחברות אחרונה בפורמט קריא
        const lastLoginElement = document.getElementById("last-login");
        const lastLoginDate = new Date(userData[username].lastLogin);  // הפורמט כבר קריא
        lastLoginElement.textContent = `Last Login: ${lastLoginDate.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })}`;
    }
}

// פונקציה ליציאה מהמערכת
document.getElementById("logout-icon").addEventListener("click", function () {
    calculateSessionDuration(); // חישוב זמן סשן לפני יציאה
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionStart");
    window.location.href = "../html/login.html";
});

// חישוב זמן סשן עם יציאה מהדף
function calculateSessionDuration() {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const sessionStart = parseInt(localStorage.getItem("currentSessionStart"));
    const now = Date.now();

    if (sessionStart && username) {
        const sessionDuration = Math.floor((now - sessionStart) / 1000); // חישוב הזמן שעבר
        const currentTotal = userData[username]?.totalTime || 0; // זמן כולל קיים בשניות
        const newTotal = currentTotal + sessionDuration; // חישוב הזמן הכולל החדש

        userData[username].totalTime = newTotal;
        localStorage.setItem("userData", JSON.stringify(userData));
    }
}

// עדכון מידע עם טעינת העמוד
window.addEventListener("load", function () {
    const username = localStorage.getItem("currentUser");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (username) {
        // עדכון שעת התחברות
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

        // עדכון זמן התחלה
        localStorage.setItem("currentSessionStart", Date.now());

        // עדכון מידע ב- DOM
        updateUserInfo();
    }
});

// חישוב זמן סשן עם יציאה מהדף
window.addEventListener("beforeunload", function () {
    calculateSessionDuration();
});
