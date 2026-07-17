/* CLIENT MODAL ELEMENTS */

const openAddClientModalButton = document.querySelector(
    "#open-add-client-modal"
);

const addClientModal = document.querySelector(
    "#add-client-modal"
);

const closeAddClientModalButton = document.querySelector(
    "#close-add-client-modal"
);

const clientForm = document.querySelector(
    "#client-form"
);

const clientNameInput = document.querySelector(
    "#client-name"
);

const clientEmailInput = document.querySelector(
    "#client-email"
);

const clientPhoneInput = document.querySelector(
    "#client-phone"
);

const clientCompanyInput = document.querySelector(
    "#client-company"
);

const clientDealValueInput = document.querySelector(
    "#client-deal-value"
);

const clientStatusInput = document.querySelector(
    "#client-status"
);

const clientsList = document.querySelector(
    "#clients-list"
);

const clientSort = document.querySelector(
    "#client-sort"
);


/* AUTO CLOSE TIMER */

let autoCloseTimer;


/* OPEN MODAL */

function openAddClientModal() {
    addClientModal.classList.remove("hidden");

    clearTimeout(autoCloseTimer);

    autoCloseTimer = setTimeout(() => {
        closeAddClientModal();
    }, 10000);
}


/* CLOSE MODAL */

function closeAddClientModal() {
    addClientModal.classList.add("hidden");

    clearTimeout(autoCloseTimer);
}


/* STOP AUTO CLOSE */

function stopAutoClose() {
    clearTimeout(autoCloseTimer);
}


/* CREATE CLIENT */

function createClient() {
    return {
        id: Date.now(),
        name: clientNameInput.value.trim(),
        email: clientEmailInput.value
            .trim()
            .toLowerCase(),
        phone: clientPhoneInput.value.trim(),
        company: clientCompanyInput.value.trim(),
        image: "",
        status: clientStatusInput.value,
        dealValue: Number(
            clientDealValueInput.value
        ),
        notes: [],
        createdAt: new Date().toISOString(),
    };
}


/* SORT CLIENTS */

function sortClients(clients) {
    const sortedClients = [...clients];

    if (clientSort.value === "newest") {
        sortedClients.sort((a, b) => {
            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        });
    }

    if (clientSort.value === "oldest") {
        sortedClients.sort((a, b) => {
            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );
        });
    }

    if (clientSort.value === "name-az") {
        sortedClients.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    if (clientSort.value === "name-za") {
        sortedClients.sort((a, b) => {
            return b.name.localeCompare(a.name);
        });
    }

    if (clientSort.value === "deal-high") {
        sortedClients.sort((a, b) => {
            return b.dealValue - a.dealValue;
        });
    }

    if (clientSort.value === "deal-low") {
        sortedClients.sort((a, b) => {
            return a.dealValue - b.dealValue;
        });
    }

    return sortedClients;
}


/* RENDER CLIENTS */

function renderClients(clients) {
    if (!clientsList) {
        return;
    }

    if (clients.length === 0) {
        clientsList.innerHTML = `
            <p>No clients found.</p>
        `;

        return;
    }

    clientsList.innerHTML = clients
        .map((client) => {
            return `
                <article class="client-card">

                    <h3>
                        ${client.name}
                    </h3>

                    <p>
                        <strong>Company:</strong>
                        ${client.company || "No company"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${client.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${client.phone}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${client.status}
                    </p>

                    <p>
                        <strong>Deal Value:</strong>
                        $${client.dealValue}
                    </p>

                </article>
            `;
        })
        .join("");
}


/* DISPLAY SORTED CLIENTS */

function displaySortedClients() {
    const clients = getClients();

    const sortedClients = sortClients(clients);

    renderClients(sortedClients);
}


/* ADD CLIENT */

function handleClientSubmit(event) {
    event.preventDefault();

    const newClient = createClient();

    const updatedClients =
        addClientToStorage(newClient);

    const sortedClients =
        sortClients(updatedClients);

    renderClients(sortedClients);

    clientForm.reset();

    closeAddClientModal();

    showToast("Client added successfully");
}


/* EVENT LISTENERS */

openAddClientModalButton.addEventListener(
    "click",
    openAddClientModal
);

closeAddClientModalButton.addEventListener(
    "click",
    closeAddClientModal
);

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        !addClientModal.classList.contains("hidden")
    ) {
        closeAddClientModal();
    }
});

addClientModal.addEventListener(
    "click",
    (event) => {
        if (event.target === addClientModal) {
            closeAddClientModal();
        }
    }
);

clientForm.addEventListener(
    "input",
    stopAutoClose
);

clientEmailInput.addEventListener(
    "input",
    () => {
        clientEmailInput.value =
            clientEmailInput.value.toLowerCase();
    }
);

clientForm.addEventListener(
    "submit",
    handleClientSubmit
);

clientSort.addEventListener(
    "change",
    displaySortedClients
);


/* PAGE INITIALIZATION */

loadClients()
    .then((clients) => {
        const sortedClients =
            sortClients(clients);

        renderClients(sortedClients);
    })
    .catch(() => {
        clientsList.innerHTML = `
            <p>Could not load clients.</p>
        `;
    });