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

const clientSearch = document.querySelector(
    "#client-search"
);

const filterButtons = document.querySelectorAll(
    ".filter-button"
);

const clientModalTitle = addClientModal.querySelector(
    "h2"
);

const clientSubmitButton = clientForm.querySelector(
    'button[type="submit"]'
);


/* ACTIVE FILTER */

let activeStatus = "All";


/* EDITING CLIENT */

let editingClientId = null;


/* AUTO CLOSE TIMER */

let autoCloseTimer;


/* START AUTO CLOSE TIMER */

function startAutoCloseTimer() {
    clearTimeout(autoCloseTimer);

    autoCloseTimer = setTimeout(() => {
        closeAddClientModal();
    }, 10000);
}


/* OPEN ADD CLIENT MODAL */

function openAddClientModal() {
    editingClientId = null;

    clientForm.reset();

    if (clientModalTitle) {
        clientModalTitle.textContent = "Add Client";
    }

    if (clientSubmitButton) {
        clientSubmitButton.textContent = "Add Client";
    }

    addClientModal.classList.remove("hidden");

    startAutoCloseTimer();
}


/* OPEN EDIT CLIENT MODAL */

function openEditClientModal(client) {
    editingClientId = client.id;

    clientNameInput.value = client.name;
    clientEmailInput.value = client.email;
    clientPhoneInput.value = client.phone;
    clientCompanyInput.value = client.company || "";
    clientDealValueInput.value = client.dealValue;
    clientStatusInput.value = client.status;

    if (clientModalTitle) {
        clientModalTitle.textContent = "Edit Client";
    }

    if (clientSubmitButton) {
        clientSubmitButton.textContent = "Save Changes";
    }

    addClientModal.classList.remove("hidden");

    startAutoCloseTimer();
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


/* CREATE UPDATED CLIENT */

function createUpdatedClient(existingClient) {
    return {
        ...existingClient,
        name: clientNameInput.value.trim(),
        email: clientEmailInput.value
            .trim()
            .toLowerCase(),
        phone: clientPhoneInput.value.trim(),
        company: clientCompanyInput.value.trim(),
        status: clientStatusInput.value,
        dealValue: Number(
            clientDealValueInput.value
        ),
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


/* FILTER CLIENTS */

function filterClients(clients) {
    if (activeStatus === "All") {
        return clients;
    }

    return clients.filter((client) => {
        return client.status === activeStatus;
    });
}


/* SEARCH CLIENTS */

function searchClients(clients) {
    const searchValue = clientSearch.value
        .trim()
        .toLowerCase();

    return clients.filter((client) => {
        const clientName = client.name
            .toLowerCase();

        const clientCompany = (
            client.company || ""
        ).toLowerCase();

        return (
            clientName.includes(searchValue) ||
            clientCompany.includes(searchValue)
        );
    });
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

                    <button
                        class="edit-client-button"
                        data-client-id="${client.id}"
                        type="button"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-client-button"
                        data-client-id="${client.id}"
                        type="button"
                    >
                        Delete
                    </button>

                </article>
            `;
        })
        .join("");
}


/* DISPLAY CLIENTS */

function displayClients() {
    const clients = getClients();

    const statusFilteredClients =
        filterClients(clients);

    const searchedClients =
        searchClients(statusFilteredClients);

    const sortedClients =
        sortClients(searchedClients);

    renderClients(sortedClients);
}


/* HANDLE FILTER BUTTON */

function handleFilterButton(event) {
    activeStatus = event.currentTarget.dataset.status;

    filterButtons.forEach((button) => {
        button.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    displayClients();
}


/* EDIT CLIENT */

function handleClientEdit(event) {
    const editButton = event.target.closest(
        ".edit-client-button"
    );

    if (!editButton) {
        return;
    }

    const clientId = Number(
        editButton.dataset.clientId
    );

    const clients = getClients();

    const selectedClient = clients.find((client) => {
        return client.id === clientId;
    });

    if (!selectedClient) {
        showToast("Client could not be found");

        return;
    }

    openEditClientModal(selectedClient);
}


/* DELETE CLIENT */

function handleClientDelete(event) {
    const deleteButton = event.target.closest(
        ".delete-client-button"
    );

    if (!deleteButton) {
        return;
    }

    const clientId = Number(
        deleteButton.dataset.clientId
    );

    const shouldDelete = confirm(
        "Are you sure you want to delete this client?"
    );

    if (!shouldDelete) {
        return;
    }

    removeClientFromStorage(clientId);

    displayClients();

    showToast("Client deleted successfully");
}


/* HANDLE CLIENT FORM */

function handleClientSubmit(event) {
    event.preventDefault();

    if (editingClientId !== null) {
        const clients = getClients();

        const existingClient = clients.find((client) => {
            return client.id === editingClientId;
        });

        if (!existingClient) {
            showToast("Client could not be found");

            return;
        }

        const updatedClient =
            createUpdatedClient(existingClient);

        updateClientInStorage(updatedClient);

        showToast("Client updated successfully");
    } else {
        const newClient = createClient();

        addClientToStorage(newClient);

        showToast("Client added successfully");
    }

    displayClients();

    clientForm.reset();

    editingClientId = null;

    closeAddClientModal();
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
    displayClients
);

clientSearch.addEventListener(
    "input",
    displayClients
);

clientsList.addEventListener(
    "click",
    handleClientEdit
);

clientsList.addEventListener(
    "click",
    handleClientDelete
);

filterButtons.forEach((button) => {
    button.addEventListener(
        "click",
        handleFilterButton
    );
});


/* PAGE INITIALIZATION */

loadClients()
    .then(() => {
        displayClients();
    })
    .catch(() => {
        clientsList.innerHTML = `
            <p>Could not load clients.</p>
        `;
    });