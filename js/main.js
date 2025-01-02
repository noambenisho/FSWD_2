// אתחול זמן התחלת הסשן
const sessionStartTime = Date.now();

// מאזין לכפתור ה-Logout
document.getElementById("logout-icon").addEventListener("click", function () {
    calculateSessionDuration();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentSessionStart");
});

// מחשב את זמן הסשן הנוכחי ומעדכן את המשתמש
function calculateSessionDuration() {
    const currentUser = localStorage.getItem("currentUser");
    const sessionStart = localStorage.getItem("currentSessionStart");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (currentUser && sessionStart) {
        const sessionDuration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000); // זמן בסשן (שניות)

        // עדכון זמן כולל למשתמש הנוכחי
        if (!userData[currentUser]) {
            userData[currentUser] = { totalTime: 0 };
        }
        userData[currentUser].totalTime += sessionDuration;

        localStorage.setItem("userData", JSON.stringify(userData));
    }
}

// מחשב את הזמן בעת יציאה מהדף
window.addEventListener("beforeunload", calculateSessionDuration);





