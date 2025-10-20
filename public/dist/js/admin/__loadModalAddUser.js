import { createElement } from "../components/_CreateElement.js";
import { getPermissions } from "./__getPermissions.js";
import { closeModal } from "./__closeModal.js";
import { getUserList } from "./__getUserList.js";
import { loadUserList } from "./__loadUserList.js";

export const loadModalAddUser = async () => {
    const existingModal = document.querySelector(".modal-container");
    if (existingModal) existingModal.remove();

    const permissionElements = createElement("div", { class: "permissions-container" }, []);
    const permissions = await getPermissions();

    permissions.forEach(e => {
        const permissionElement = createElement("div", { class: "permission", id: "permission" + e.id }, [
            createElement("label", { for: "chk-permission" + e.id }, [e.name, " : "]),
            createElement("label", { class: "permission-description", for: "chk-permission" + e.id }, [e.description]),
            createElement("input", { type: "checkbox", class: "chk-permission", id: "chk-permission" + e.id, name: "chk-permission" + e.id }),
            createElement("label", { for: "chk-permission" + e.id, class: "switch" })
        ]);
        permissionElements.appendChild(permissionElement);
    });

    const modalContainer = createElement("div", { class: "modal-container" }, [
        createElement("div", { class: "modal add-user-modal" }, [
            createElement("div", { class: "modal-header" }, [
                createElement("input", { type: "text", id: "user-name-add", min: "3", class: "modal-title modal-edit-username", placeholder: "nom de l'utilisateur", autocomplete: "off" })
            ]),
            createElement("div", { class: "modal-body" }, [
                createElement("div", { class: "description-container" }, [
                    createElement("label", { for: "description" }, ["Description :"]),
                    createElement("textarea", { id: "description", name: "description", rows: "4", cols: "50", autocomplete: "off" }, ["Description de l'utilisateur"])
                ]),
                createElement("div", { class: "password-container" }, [
                    createElement("label", { for: "password" }, ["Mot de passe :"]),
                    createElement("input", { type: "password", id: "password", name: "password", placeholder: "mot de passe", autocomplete: "new-password" })
                ])
            ]),
            createElement("div", { class: "modal-footer" }, [
                createElement("button", { class: "btn btn-cancel", id: "cancel-btn" }, ["Annuler"]),
                createElement("button", { class: "btn btn-save", id: "save-btn" }, ["Enregistrer"])
            ])
        ])
    ]);
    document.body.appendChild(modalContainer);

    document.getElementById("cancel-btn").addEventListener("click", closeModal);

    document.getElementById("save-btn").addEventListener("click", async () => {
        const newUsername = document.getElementById("user-name-add").value.trim().replace(/\s+/g, '_').toLowerCase();
        const newDescription = document.getElementById("description").value;
        const newPassword = document.getElementById("password").value;
        try {
            const newUser = await fetch("/api/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ username: newUsername, description: newDescription, password: newPassword })
            });
            const data = await newUser.json();
            if (!data.valid) {
                alert("échec de l'ajout de l'utilisateur : mot de passe ou nom d'utilisateur invalide.");
            } else {
                alert("Utilisateur créé avec succès.");
                closeModal();
                loadUserList(await getUserList());
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("échec de l'ajout de l'utilisateur.");
        }
    });
    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
};