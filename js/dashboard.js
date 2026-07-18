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

const activeDealsElement = document.querySelector(
    "#active-deals"
);

const wonRevenueElement = document.querySelector(
    "#won-revenue"
);

const newThisWeekElement = document.querySelector(
    "#new-this-week"
);

const pipelineLeadElement = document.querySelector(
    "#pipeline-lead"
);

const pipelineContactedElement = document.querySelector(
    "#pipeline-contacted"
);

const pipelineWonElement = document.querySelector(
    "#pipeline-won"
);

const pipelineLostElement = document.querySelector(
    "#pipeline-lost"
);

const recentClientsList = document.querySelector(
    "#recent-clients-list"
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


/* ACTIVE DEALS */

function displayActiveDeals() {
    if (!activeDealsElement) {
        return;
    }

    const clients = getClients();

    const activeDeals = clients.filter((client) => {
        return (
            client.status === "Lead" ||
            client.status === "Contacted"
        );
    });

    activeDealsElement.textContent =
        activeDeals.length;
}


/* WON REVENUE */

function displayWonRevenue() {
    if (!wonRevenueElement) {
        return;
    }

    const clients = getClients();

    const wonRevenue = clients
        .filter((client) => {
            return client.status === "Won";
        })
        .reduce((total, client) => {
            return (
                total +
                Number(client.dealValue || 0)
            );
        }, 0);

    wonRevenueElement.textContent =
        `$${wonRevenue.toLocaleString()}`;
}


/* NEW THIS WEEK */

function displayNewThisWeek() {
    if (!newThisWeekElement) {
        return;
    }

    const clients = getClients();

    const currentDate = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
        currentDate.getDate() - 7
    );

    const newClients = clients.filter((client) => {
        const clientCreatedDate =
            new Date(client.createdAt);

        return (
            clientCreatedDate >= sevenDaysAgo &&
            clientCreatedDate <= currentDate
        );
    });

    newThisWeekElement.textContent =
        newClients.length;
}


/* PIPELINE OVERVIEW */

function displayPipelineOverview() {
    const clients = getClients();

    const leadClients = clients.filter((client) => {
        return client.status === "Lead";
    });

    const contactedClients = clients.filter((client) => {
        return client.status === "Contacted";
    });

    const wonClients = clients.filter((client) => {
        return client.status === "Won";
    });

    const lostClients = clients.filter((client) => {
        return client.status === "Lost";
    });

    if (pipelineLeadElement) {
        pipelineLeadElement.textContent =
            leadClients.length;
    }

    if (pipelineContactedElement) {
        pipelineContactedElement.textContent =
            contactedClients.length;
    }

    if (pipelineWonElement) {
        pipelineWonElement.textContent =
            wonClients.length;
    }

    if (pipelineLostElement) {
        pipelineLostElement.textContent =
            lostClients.length;
    }
}


/* RECENT CLIENTS */

function displayRecentClients() {
    if (!recentClientsList) {
        return;
    }

    const clients = getClients();

    const recentClients = [...clients]
        .sort((a, b) => {
            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        })
        .slice(0, 4);

    if (recentClients.length === 0) {
        recentClientsList.innerHTML = `
            <p>No clients added yet.</p>
        `;

        return;
    }

    recentClientsList.innerHTML = recentClients
        .map((client) => {
            const dealValue = Number(
                client.dealValue || 0
            );

            return `
                <article class="recent-client-card">

                    <h3 class="recent-client-name">
                        ${client.name}
                    </h3>

                    <p class="recent-client-company">
                        ${client.company || "No company"}
                    </p>

                    <strong class="recent-client-value">
                        $${dealValue.toLocaleString()}
                    </strong>

                    <span class="recent-client-status">
                        ${client.status}
                    </span>

                </article>
            `;
        })
        .join("");
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
        showToast(
            "There are no clients to export"
        );

        return;
    }

    const shouldExport = confirm(
        "Are you sure you want to export all client data?"
    );

    if (!shouldExport) {
        return;
    }

    const csvContent =
        createClientsCSV(clients);

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

    document.body.appendChild(
        downloadLink
    );

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

displayActiveDeals();

displayWonRevenue();

displayNewThisWeek();

displayPipelineOverview();

displayRecentClients();