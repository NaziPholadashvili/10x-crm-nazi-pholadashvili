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

addClientModal.addEventListener("click", (event) => {
    if (event.target === addClientModal) {
        closeAddClientModal();
    }
});

clientForm.addEventListener(
    "input",
    stopAutoClose,
    { once: true }
);