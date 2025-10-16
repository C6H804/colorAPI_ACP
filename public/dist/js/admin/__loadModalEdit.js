import { createElement } from "../components/_CreateElement.js";
import { closeModal } from "./__closeModal.js";
import { saveEditData } from "./__saveEditData.js";
import { loadUserList } from "./__loadUserList.js";
import { getUserList } from "./__getUserList.js";

export const loadModalEdit = (user, permissions, userPermissions) => {
    const existingModal = document.querySelector(".modal-container");
    if (existingModal) existingModal.remove();

    const permissionElements = createElement("div", { class: "permissions-container" }, []);
    permissions.forEach(e => {
        const checked = userPermissions.find(p => p.id === e.id) ? true : false;
        const permissionElement = createElement("div", { class: "permission", id: "permission" + e.id }, [
            createElement("label", { for: "chk-permission" + e.id }, [e.name, " : "]),
            createElement("label", { class: "permission-description", for: "chk-permission" + e.id }, [e.description]),
            checked ? createElement("input", { type: "checkbox", class: "chk-permission", id: "chk-permission" + e.id, name: "chk-permission" + e.id, checked: "checked" }) :
                createElement("input", { type: "checkbox", class: "chk-permission", id: "chk-permission" + e.id, name: "chk-permission" + e.id }),
            createElement("label", { for: "chk-permission" + e.id, class: "switch" })
        ]);
        if (e.name === "admin") permissionElement.querySelector("input").disabled = true;
        permissionElements.appendChild(permissionElement);
    });

    const modalContainer = createElement("div", { class: "modal-container" }, [
        createElement("div", { class: "modal edit-user-modal" }, [
            createElement("div", { class: "modal-header" }, [
                createElement("input", { type: "text", autocomplete: "off", id: "user-name-edit", min: "3", class: "modal-title modal-edit-username", value: user.username })
            ]),
            createElement("div", { class: "modal-body" }, [
                createElement("div", { class: "description-container" }, [
                    createElement("label", { for: "description" }, ["Description :"]),
                    createElement("textarea", { id: "description", name: "description", rows: "4", cols: "50" }, [user.description])
                ]),
                createElement("div", { class: "permissions-container" }, [
                    createElement("h3", {}, ["Permissions : "]),
                    permissionElements
                ]),
                createElement("div", { class: "change-password-container" }, [
                    createElement("label", { for: "new-password" }, ["Mot de passe :"]),
                    createElement("input", { type: "password", id: "new-password", name: "new-password", placeholder: "Laisser vide pour ne pas changer...", autocomplete: "new-password" })
                ])
            ]
            ),
            createElement("div", { class: "modal-footer" }, [
                createElement("button", { class: "btn btn-cancel", id: "cancel-btn", title: "Annuler les modifications" }, ["Annuler"]),
                createElement("button", { class: "btn btn-save", id: "save-btn", title: "Enregistrer les modifications" }, ["Enregistrer"]),
                createElement("a", { class: "delete-btn btn", id: "delete-btn", title: "Supprimer l'utilisateur" }, ["Supprimer"])
            ])
        ])
    ]);

    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    document.body.appendChild(modalContainer);

    document.getElementById("cancel-btn").addEventListener("click", closeModal);

    document.getElementById("save-btn").addEventListener("click", async () => saveEditData(user));

    document.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") await saveEditData(user);
    });



    // suppression de l'utilisateur
    document.getElementById("delete-btn").addEventListener("click", async () => {
        if (confirm("Êtes-vous sûr de vouloir supprmer cette utilisateur ? Cette action est irréversible.")) {
            try {
                const response = await fetch("/api/deleteUser/" + user.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await response.json();
                if (!data.valid) return alert("Erreur : " + data.message);
                closeModal();
                alert("Utilisateur supprimé avec succès.");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("échec de la suppression de l'utilisateur.");
            }
            loadUserList(await getUserList());
        }
    });
};