/* SHARED STORAGE KEYS */

const THEME_KEY = "crm_theme";
const SESSION_KEY = "crm_session";

let toastTimer;


/* THEME */

function updateThemeButton(theme) {
    const themeToggleButton = document.querySelector("#theme-toggle");

    if (!themeToggleButton) {
        return;
    }

    if (theme === "light") {
        themeToggleButton.textContent = "Dark Theme";
    } else {
        themeToggleButton.textContent = "Light Theme";
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }

    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const isLightTheme = document.body.classList.toggle("light-theme");

    let selectedTheme;

    if (isLightTheme) {
        selectedTheme = "light";
    } else {
        selectedTheme = "dark";
    }

    localStorage.setItem(THEME_KEY, selectedTheme);

    updateThemeButton(selectedTheme);
}


/* TOAST NOTIFICATION */

function showToast(message, type = "success") {
    const toast = document.querySelector("#toast");

    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.remove("success", "error");
    toast.classList.add(type, "show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show", "success", "error");
    }, 3000);
}


/* LOGOUT */

function logout() {
    localStorage.removeItem(SESSION_KEY);

    window.location.href = "index.html";
}


/* EVENT LISTENERS */

const themeToggleButton = document.querySelector("#theme-toggle");
const logoutButton = document.querySelector("#logout-button");

if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
}

if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}


/* PAGE INITIALIZATION */

applySavedTheme();