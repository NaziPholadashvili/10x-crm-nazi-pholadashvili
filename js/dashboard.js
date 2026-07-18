/* DASHBOARD ELEMENTS */

const liveClock = document.querySelector("#live-clock");

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

    liveClock.textContent = currentDate.toLocaleString();
}


/* CURRENT USER */

function getCurrentUser() {
    const storedSession = localStorage.getItem(
        SESSION_KEY
    );

    if (storedSession === null) {
        return null;
    }

    const session = JSON.parse(storedSession);

    const users = JSON.parse(
        localStorage.getItem("crm_users")
    ) || [];

    return users.find((user) => {
        return user.id === session.userId;
    }) || null;
}


/* WELCOME MESSAGE */

function displayWelcomeMessage() {
    if (!welcomeMessage) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        welcomeMessage.textContent = "Welcome back!";
        return;
    }

    welcomeMessage.textContent =
        `Welcome back, ${currentUser.fullName}!`;
}


/* TOTAL CLIENTS */

function displayTotalClients() {
    if (!totalClientsElement) {
        return;
    }

    const clients = getClients();

    totalClientsElement.textContent = clients.length;
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

    activeDealsElement.textContent = activeDeals.length;
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
            return total + Number(client.dealValue || 0);
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
        const clientCreatedDate = new Date(
            client.createdAt
        );

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

    const pipelineCounts = clients.reduce(
        (counts, client) => {
            if (client.status === "Lead") {
                counts.lead++;
            } else if (client.status === "Contacted") {
                counts.contacted++;
            } else if (client.status === "Won") {
                counts.won++;
            } else if (client.status === "Lost") {
                counts.lost++;
            }

            return counts;
        },
        {
            lead: 0,
            contacted: 0,
            won: 0,
            lost: 0,
        }
    );

    if (pipelineLeadElement) {
        pipelineLeadElement.textContent =
            pipelineCounts.lead;
    }

    if (pipelineContactedElement) {
        pipelineContactedElement.textContent =
            pipelineCounts.contacted;
    }

    if (pipelineWonElement) {
        pipelineWonElement.textContent =
            pipelineCounts.won;
    }

    if (pipelineLostElement) {
        pipelineLostElement.textContent =
            pipelineCounts.lost;
    }
}


/* RECENT CLIENT CARD */

function createRecentClientCard(client) {
    const card = document.createElement("article");
    const name = document.createElement("h3");
    const company = document.createElement("p");
    const dealValue = document.createElement("strong");
    const status = document.createElement("span");

    card.classList.add("recent-client-card");
    name.classList.add("recent-client-name");
    company.classList.add("recent-client-company");
    dealValue.classList.add("recent-client-value");
    status.classList.add("recent-client-status");

    const clientDealValue = Number(
        client.dealValue || 0
    );

    name.textContent = client.name;
    company.textContent =
        client.company || "No company";

    dealValue.textContent =
        `$${clientDealValue.toLocaleString()}`;

    status.textContent = client.status;

    card.append(
        name,
        company,
        dealValue,
        status
    );

    return card;
}


/* RECENT CLIENTS */

function displayRecentClients() {
    if (!recentClientsList) {
        return;
    }

    const clients = getClients();

    const recentClients = [...clients]
        .sort((firstClient, secondClient) => {
            return (
                new Date(secondClient.createdAt) -
                new Date(firstClient.createdAt)
            );
        })
        .slice(0, 4);

    recentClientsList.replaceChildren();

    if (recentClients.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No clients added yet.";

        recentClientsList.append(emptyMessage);

        return;
    }

    recentClients.forEach((client) => {
        const clientCard =
            createRecentClientCard(client);

        recentClientsList.append(clientCard);
    });
}


/* ESCAPE CSV VALUE */

function escapeCSVValue(value) {
    const stringValue = String(value ?? "");

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
        "Created At",
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
            client.createdAt,
        ]
            .map(escapeCSVValue)
            .join(",");
    });

    const headerRow = headers
        .map(escapeCSVValue)
        .join(",");

    return [headerRow, ...rows].join("\n");
}


/* EXPORT CLIENTS */

function exportClients() {
    const clients = getClients();

    if (clients.length === 0) {
        showToast(
            "There are no clients to export",
            "error"
        );

        return;
    }

    const shouldExport = window.confirm(
        "Are you sure you want to export all client data?"
    );

    if (!shouldExport) {
        return;
    }

    const csvContent = createClientsCSV(clients);

    const csvBlob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;",
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

    document.body.append(downloadLink);

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadURL);

    showToast(
        "Client data exported successfully",
        "success"
    );
}


/* DASHBOARD DISPLAY */

function displayDashboardData() {
    displayTotalClients();
    displayActiveDeals();
    displayWonRevenue();
    displayNewThisWeek();
    displayPipelineOverview();
    displayRecentClients();
}


/* PAGE INITIALIZATION */

async function initializeDashboard() {
    displayWelcomeMessage();

    if (liveClock) {
        updateClock();
        setInterval(updateClock, 1000);
    }

    try {
        await loadClients();
        displayDashboardData();
    } catch (error) {
        console.error(error);

        showToast(
            "Could not load dashboard data",
            "error"
        );

        displayDashboardData();
    }

    if (exportClientsButton) {
        exportClientsButton.addEventListener(
            "click",
            exportClients
        );
    }
}

initializeDashboard();