/* DASHBOARD ELEMENTS */

const liveClock = document.querySelector("#live-clock");
const welcomeMessage = document.querySelector("#welcome-message");
const totalClientsElement = document.querySelector("#total-clients");


/* LIVE CLOCK */

function updateClock() {
    if (!liveClock) {
        return;
    }

    const currentDate = new Date();

    liveClock.textContent = currentDate.toLocaleString();
}


/* CURRENT USER */

function getCurrentUser() {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );

    if (!session) {
        return null;
    }

    const users = JSON.parse(
        localStorage.getItem("crm_users")
    ) || [];

    return users.find((user) => {
        return user.id === session.userId;
    });
}


/* WELCOME MESSAGE */

function displayWelcomeMessage() {
    if (!welcomeMessage) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    welcomeMessage.textContent =
        `Welcome back, ${currentUser.fullName}!`;
}


/* CLIENTS */

function getClients() {
    return JSON.parse(
        localStorage.getItem("crm_clients")
    ) || [];
}


/* TOTAL CLIENTS */

function displayTotalClients() {
    if (!totalClientsElement) {
        return;
    }

    const clients = getClients();

    totalClientsElement.textContent = clients.length;
}


/* PAGE INITIALIZATION */

updateClock();

setInterval(updateClock, 1000);

displayWelcomeMessage();

displayTotalClients();