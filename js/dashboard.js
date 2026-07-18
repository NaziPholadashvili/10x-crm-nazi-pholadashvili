/* DASHBOARD ELEMENTS */

const liveClock = document.querySelector(
    "#live-clock"
);

const welcomeMessage = document.querySelector(
    "#welcome-message"
);

const totalClientsElement = document.querySelector(
    "#total-clients"
);

const exportClientsButton = document.querySelector(
    "#export-clients-button"
);


/* LIVE CLOCK */

function updateClock() {
    if (!liveClock) {
        return;
    }

    const currentDate = new Date();

    liveClock.textContent =
        currentDate.toLocaleString();
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

    totalClientsElement.textContent =
        clients.length;
}


/* ESCAPE CSV VALUE */

function escapeCSVValue(value) {
    const stringValue = String(
        value ?? ""
    );

    const escapedValue = stringValue.replace(
        /"/g,
        '""'
    );

    return `"${escapedValue}"`;
}


/* CREATE CSV CONTENT */

function createClientsCSV(clients) {
    const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Status",
        "Deal Value",
        "Created At"
    ];

    const rows = clients.map((client) => {
        return [
            client.id,
            client.name,
            client.email,
            client.phone,
            client.company || "",
            client.status,
            client.dealValue,
            client.createdAt
        ]
            .map(escapeCSVValue)
            .join(",");
    });

    const headerRow = headers
        .map(escapeCSVValue)
        .join(",");

    return [
        headerRow,
        ...rows
    ].join("\n");
}


/* EXPORT CLIENTS */

function exportClients() {
    const clients = getClients();

    if (clients.length === 0) {
        showToast("There are no clients to export");

        return;
    }

    const shouldExport = confirm(
        "Are you sure you want to export all client data?"
    );

    if (!shouldExport) {
        return;
    }

    const csvContent = createClientsCSV(clients);

    const csvBlob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const downloadURL =
        URL.createObjectURL(csvBlob);

    const downloadLink =
        document.createElement("a");

    const currentDate = new Date()
        .toISOString()
        .split("T")[0];

    downloadLink.href = downloadURL;

    downloadLink.download =
        `crm-clients-${currentDate}.csv`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(downloadURL);

    showToast(
        "Client data exported successfully"
    );
}


/* EVENT LISTENERS */

if (exportClientsButton) {
    exportClientsButton.addEventListener(
        "click",
        exportClients
    );
}


/* PAGE INITIALIZATION */

updateClock();

setInterval(updateClock, 1000);

displayWelcomeMessage();

displayTotalClients();