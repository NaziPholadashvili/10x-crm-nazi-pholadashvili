/* PROFILE ELEMENTS */

const profileAvatar = document.querySelector(
    "#profile-avatar"
);

const profileName = document.querySelector(
    "#profile-name"
);

const profileEmail = document.querySelector(
    "#profile-email"
);

const profileCompany = document.querySelector(
    "#profile-company"
);

const memberSince = document.querySelector(
    "#member-since"
);

const profileForm = document.querySelector(
    "#profile-form"
);

const profileFullNameInput = document.querySelector(
    "#profile-full-name"
);

const profileCompanyInput = document.querySelector(
    "#profile-company-input"
);

const profileFullNameError = document.querySelector(
    "#profile-full-name-error"
);

const passwordForm = document.querySelector(
    "#password-form"
);

const currentPasswordInput = document.querySelector(
    "#current-password"
);

const newPasswordInput = document.querySelector(
    "#new-password"
);

const confirmNewPasswordInput = document.querySelector(
    "#confirm-new-password"
);

const currentPasswordError = document.querySelector(
    "#current-password-error"
);

const newPasswordError = document.querySelector(
    "#new-password-error"
);

const confirmNewPasswordError = document.querySelector(
    "#confirm-new-password-error"
);

const resetCRMDataButton = document.querySelector(
    "#reset-crm-data"
);


/* STORAGE HELPERS */

function getUsers() {
    return JSON.parse(
        localStorage.getItem("crm_users")
    ) || [];
}


function saveUsers(users) {
    localStorage.setItem(
        "crm_users",
        JSON.stringify(users)
    );
}


function getSession() {
    return JSON.parse(
        localStorage.getItem("crm_session")
    );
}


/* CURRENT USER */

function getCurrentUser() {
    const session = getSession();

    if (!session) {
        return null;
    }

    const users = getUsers();

    return users.find((user) => {
        return user.id === session.userId;
    }) || null;
}


/* TOAST HELPER */

function displayProfileToast(
    message,
    type = "success"
) {
    if (typeof showToast === "function") {
        showToast(message, type);

        return;
    }

    alert(message);
}


/* CREATE USER INITIALS */

function getUserInitials(fullName) {
    if (!fullName) {
        return "--";
    }

    const nameParts = fullName
        .trim()
        .split(/\s+/);

    const initials = nameParts
        .slice(0, 2)
        .map((namePart) => {
            return namePart[0];
        })
        .join("");

    return initials.toUpperCase();
}


/* FORMAT MEMBER DATE */

function formatMemberDate(dateValue) {
    if (!dateValue) {
        return "Unknown";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


/* DISPLAY PROFILE */

function displayProfile() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    if (profileAvatar) {
        profileAvatar.textContent =
            getUserInitials(
                currentUser.fullName
            );
    }

    if (profileName) {
        profileName.textContent =
            currentUser.fullName;
    }

    if (profileEmail) {
        profileEmail.textContent =
            currentUser.email;
    }

    if (profileCompany) {
        profileCompany.textContent =
            currentUser.company ||
            "No company";
    }

    if (memberSince) {
        memberSince.textContent =
            formatMemberDate(
                currentUser.createdAt
            );
    }

    if (profileFullNameInput) {
        profileFullNameInput.value =
            currentUser.fullName;
    }

    if (profileCompanyInput) {
        profileCompanyInput.value =
            currentUser.company || "";
    }
}


/* CLEAR PROFILE ERRORS */

function clearProfileErrors() {
    if (profileFullNameError) {
        profileFullNameError.textContent = "";
    }

    if (profileFullNameInput) {
        profileFullNameInput.classList.remove(
            "input-error"
        );
    }
}


/* VALIDATE PROFILE */

function validateProfile() {
    clearProfileErrors();

    const fullName =
        profileFullNameInput.value.trim();

    if (fullName.length < 2) {
        profileFullNameError.textContent =
            "Full name must contain at least 2 characters";

        profileFullNameInput.classList.add(
            "input-error"
        );

        return false;
    }

    return true;
}


/* UPDATE PROFILE */

function updateProfile(event) {
    event.preventDefault();

    if (!validateProfile()) {
        return;
    }

    const session = getSession();
    const users = getUsers();

    if (!session) {
        return;
    }

    const userIndex = users.findIndex((user) => {
        return user.id === session.userId;
    });

    if (userIndex === -1) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    users[userIndex].fullName =
        profileFullNameInput.value.trim();

    users[userIndex].company =
        profileCompanyInput.value.trim();

    saveUsers(users);

    displayProfile();

    displayProfileToast(
        "Profile updated successfully"
    );
}


/* CLEAR PASSWORD ERRORS */

function clearPasswordErrors() {
    currentPasswordError.textContent = "";
    newPasswordError.textContent = "";
    confirmNewPasswordError.textContent = "";

    currentPasswordInput.classList.remove(
        "input-error"
    );

    newPasswordInput.classList.remove(
        "input-error"
    );

    confirmNewPasswordInput.classList.remove(
        "input-error"
    );
}


/* PASSWORD VALIDATION */

function isStrongPassword(password) {
    const hasUppercaseLetter =
        /[A-Z]/.test(password);

    const hasLowercaseLetter =
        /[a-z]/.test(password);

    const hasNumber =
        /\d/.test(password);

    const hasSpecialCharacter =
        /[^A-Za-z0-9]/.test(password);

    return (
        password.length >= 8 &&
        hasUppercaseLetter &&
        hasLowercaseLetter &&
        hasNumber &&
        hasSpecialCharacter
    );
}


/* VALIDATE PASSWORD FORM */

function validatePasswordForm(currentUser) {
    clearPasswordErrors();

    let isValid = true;

    const currentPassword =
        currentPasswordInput.value;

    const newPassword =
        newPasswordInput.value;

    const confirmNewPassword =
        confirmNewPasswordInput.value;

    if (!currentPassword) {
        currentPasswordError.textContent =
            "Current password is required";

        currentPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    } else if (
        currentPassword !==
        currentUser.password
    ) {
        currentPasswordError.textContent =
            "Current password is incorrect";

        currentPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    }

    if (!newPassword) {
        newPasswordError.textContent =
            "New password is required";

        newPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    } else if (
        !isStrongPassword(newPassword)
    ) {
        newPasswordError.textContent =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

        newPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    } else if (
        newPassword === currentPassword
    ) {
        newPasswordError.textContent =
            "New password must be different from the current password";

        newPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    }

    if (!confirmNewPassword) {
        confirmNewPasswordError.textContent =
            "Please confirm your new password";

        confirmNewPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    } else if (
        confirmNewPassword !== newPassword
    ) {
        confirmNewPasswordError.textContent =
            "Passwords do not match";

        confirmNewPasswordInput.classList.add(
            "input-error"
        );

        isValid = false;
    }

    return isValid;
}


/* CHANGE PASSWORD */

function changePassword(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    if (!validatePasswordForm(currentUser)) {
        return;
    }

    const session = getSession();
    const users = getUsers();

    const userIndex = users.findIndex((user) => {
        return user.id === session.userId;
    });

    if (userIndex === -1) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    users[userIndex].password =
        newPasswordInput.value;

    saveUsers(users);

    passwordForm.reset();

    clearPasswordErrors();

    displayProfileToast(
        "Password changed successfully"
    );
}


/* GET ORIGINAL CLIENT DATA */

function getOriginalClients() {
    if (
        typeof initialClients !==
        "undefined"
    ) {
        return initialClients;
    }

    if (
        typeof INITIAL_CLIENTS !==
        "undefined"
    ) {
        return INITIAL_CLIENTS;
    }

    if (
        typeof clientsData !==
        "undefined"
    ) {
        return clientsData;
    }

    return [];
}


/* RESET CRM DATA */

function resetCRMData() {
    const shouldReset = confirm(
        "Are you sure you want to reset all CRM client data?"
    );

    if (!shouldReset) {
        return;
    }

    const originalClients =
        getOriginalClients();

    localStorage.setItem(
        "crm_clients",
        JSON.stringify(originalClients)
    );

    displayProfileToast(
        "CRM client data reset successfully"
    );
}


/* EVENT LISTENERS */

if (profileForm) {
    profileForm.addEventListener(
        "submit",
        updateProfile
    );
}


if (passwordForm) {
    passwordForm.addEventListener(
        "submit",
        changePassword
    );
}


if (resetCRMDataButton) {
    resetCRMDataButton.addEventListener(
        "click",
        resetCRMData
    );
}


/* PAGE INITIALIZATION */

displayProfile();