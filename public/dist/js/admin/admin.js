import { createElement } from "../components/_CreateElement.js";
import { Auth } from "../components/_Auth.js";

const init = async () => {
    const auth = await Auth();
    const lang = navigator.language.slice(0, 2) || "en".slice(0, 2)
    loadUserList(await getUserList());
    loadLogs(await getLogs(), lang);
};

init();

const getUserList = async () => {
    // fonction getUserList a pour but de récupérer la liste des utilisateurs
    // récupère le token JWT dans le localStorage
    // renvoie un tableau d'objets d'utilisateurs ou un tableau vide en cas d'erreur
    try {
        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching user list:", error);
        alert("Failed to fetch user list. Please try again later.");
        return [];
    }
}

const loadUserList = async (userList) => {
    // fonction loadUserList a pour but de charger la liste des utilisateurs dans le DOM
    // prends en paramètre un tableau d'objets d'utilisateurs

    // crée les éléments HTML pour chaque utilisateur et les ajoute au conteneur
    // ajoute la logique pour ouvrir le modal d'édition d'utilisateur au clic sur un utilisateur
    
    // ajoute un bouton pour ajouter un nouvel utilisateur
    // ajoute la logique pour ouvrir le modal d'ajout d'utilisateur au clic sur le bouton

    const userListContainer = document.getElementById("user-list-container");
    userListContainer.innerHTML = "";
    userList.forEach(e => {
        const user = createElement("div", { class: "user", id: "user" + e.id }, [
            // createElement("div", { class: "username-container" }, [
            createElement("div", { class: "username" }, [e.username]),
            // ]),
            createElement("div", { class: "description" }, [e.description]),
            createElement("div", { class: "last-login" }, [new Date(e.last_connection).toLocaleString()])
        ]);
        user.addEventListener("click", () => changeUser(e.id));
        userListContainer.appendChild(user);
    });
    userListContainer.appendChild(createElement("div", { class: "add-user-container" }, [
        createElement("button", { class: "add-user btn", id: "add-user-btn" }, ["+"])
    ]));
    document.getElementById("add-user-btn").addEventListener("click", loadModalAddUser);
}

const loadModalAddUser = async () => {
    // crée et affiche le modal d'ajout d'utilisateur
    // permet de saisir le nom d'utilisateur, la description et le mot de passe
    // ajoute la logique pour enregistrer le nouvel utilisateur au clic sur le bouton "Enregistrer"

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
        const newUsername = document.getElementById("user-name-add").value.trim().replace(/\s+/g, '_');
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
                alert("Erreur : " + data.message);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("échec de l'ajout de l'utilisateur.");
        }
        loadUserList(await getUserList());
        closeModal();
    });
    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
}

const getLogs = async () => {
    try {
        const response = await fetch("/api/logs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching logs:", error);
        alert("Failed to fetch logs. Please try again later.");
        return [];
    }
}

const loadLogs = (logs, lang) => {
    const logsContainer = document.getElementById("logs-container");
    logs.forEach(e => {
        let message = "";
        if (e.description === "modification des stocks d'une couleur") {
            message = "stock changé - ";
            const oldValues = [e.change_description[41], e.change_description[50], e.change_description[61]];
            const newValues = [e.change_description[91], e.change_description[100], e.change_description[111]];
            if (oldValues[0] !== newValues[0]) message += "Mat : " + oldValues[0] + " → " + newValues[0] + " | ";
            if (oldValues[1] !== newValues[1]) message += "Brillant : " + oldValues[1] + " → " + newValues[1] + " | ";
            if (oldValues[2] !== newValues[2]) message += "Sablée : " + oldValues[2] + " → " + newValues[2] + " | ";
            message = message.slice(0, -3);

        } else {
            message = "log de type inconnue : " + e.description;
        }
        const timePassed = Date.now() - new Date(e.date).getTime();
        const log = createElement("div", { class: "log", title: calculateTimePassed(e.date, lang) }, [
            createElement("div", { class: "log-user" }, [e.username]),
            createElement("div", { class: "log-date", }, [new Date(e.date).toLocaleString()]),
            createElement("div", { class: "log-color" }, [e.value]),
            createElement("div", { class: "log-change" }, [message])
        ]);
        logsContainer.appendChild(log);
    });

}

const changeUser = async (id) => {

    const user = await getUserData(id);
    if (!user) return alert("User not found");

    const permissions = await getPermissions();
    if (permissions.length === 0) return alert("Failed to fetch permissions");

    const userPermissions = await getUserPermissions(user.id);

    loadModalEdit(user, permissions, userPermissions);
}

const calculateTimePassed = (date, lang) => {
    const translation = {
        "fr": {
            "year": "an",
            "years": "ans",
            "month": "mois",
            "months": "mois",
            "week": "semaine",
            "weeks": "semaines",
            "day": "jour",
            "days": "jours",
            "hour": "heure",
            "hours": "heures",
            "minute": "minute",
            "minutes": "minutes",
            "agoStart": "il y a ",
            "agoEnd": "",
            "now": "à l'instant"
        },
        "en": {
            "year": "year",
            "years": "years",
            "month": "month",
            "months": "months",
            "week": "week",
            "weeks": "weeks",
            "day": "day",
            "days": "days",
            "hour": "hour",
            "hours": "hours",
            "minute": "minute",
            "minutes": "minutes",
            "agoStart": "",
            "agoEnd": " ago",
            "now": "just now"
        },
        "pt": {
            "year": "ano",
            "years": "anos",
            "month": "mês",
            "months": "meses",
            "week": "semana",
            "weeks": "semanas",
            "day": "dia",
            "days": "dias",
            "hour": "hora",
            "hours": "horas",
            "minute": "minuto",
            "minutes": "minutos",
            "agoStart": "há ",
            "agoEnd": "",
            "now": "agora mesmo"
        }
    }


    let minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return translation[lang].now;
    if (minutes < 60) return translation[lang].agoStart + Math.round(minutes) + " " + translation[lang].minutes + translation[lang].agoEnd;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours < 24) return translation[lang].agoStart + Math.round(hours) + " " + translation[lang].hours + " " + Math.round(minutes) + " " + translation[lang].minutes + " " + translation[lang].agoEnd;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    if (days < 7) return translation[lang].agoStart + Math.round(days) + " " + translation[lang].days + " " + Math.round(hours) + " " + translation[lang].hours + " " + translation[lang].agoEnd;
    let weeks = Math.floor(days / 7);
    days = days % 7;
    if (weeks < 4) return translation[lang].agoStart + Math.round(weeks) + " " + translation[lang].weeks + " " + Math.round(days) + " " + translation[lang].days + " " + translation[lang].agoEnd;
    let months = Math.floor(weeks / 4);
    weeks = weeks % 4;
    if (months < 12) return translation[lang].agoStart + Math.round(months) + " " + translation[lang].months + " " + Math.round(weeks) + " " + translation[lang].weeks + " " + translation[lang].agoEnd;
    let years = Math.floor(months / 12);
    months = months % 12;
    if (years < 2) return translation[lang].agoStart + Math.round(years) + " " + translation[lang].years + " " + Math.round(months) + " " + translation[lang].months + " " + translation[lang].agoEnd;
    return translation[lang].agoStart + Math.round(years) + " " + translation[lang].years + " " + translation[lang].agoEnd;
}

const getPermissions = async () => {
    try {
        const response = await fetch("/api/permissions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        if (!data.valid) {
            console.error("Invalid permissions response:", data.message);
            return [];
        }
        return data.value;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
    }
}

const getUserPermissions = async (userId) => {
    try {
        const permissions = await fetch(`/api/permissions/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await permissions.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
    }
}

const getUserData = async (userId) => {
    const userList = await getUserList();
    if (userList.length === 0) return [];
    const user = userList.find(e => e.id === userId);
    if (!user) {
        console.error("User not found:", userId);
        return null;
    }
    return user;
}

const loadModalEdit = (user, permissions, userPermissions) => {
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
                ])
            ]
            ),
            createElement("div", { class: "modal-footer" }, [
                createElement("button", { class: "btn btn-cancel", id: "cancel-btn", title: "Annuler les modifications" }, ["Annuler"]),
                createElement("button", { class: "btn btn-save", id: "save-btn", title: "Enregistrer les modifications" }, ["Enregistrer"]),
                createElement("a", { class: "delete-btn btn", id: "delete-btn", title: "Supprimer l'utilisateur" }, [
                    createElement("img", { class: "trash-icon", src: "../img/trash-fill.svg" })
                ])
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
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("modal-close-bg");
    document.querySelector(".modal").classList.add("modal-close");



    const modal = document.querySelector(".modal-container");
        modalContainer.addEventListener("animationend", () => {
        console.log("close modal");
        modalContainer.remove();
        document.querySelectorAll(".modal-container").forEach(e => e.remove());
    });
};

const saveEditData = async (user) => {
    const newUsername = document.getElementById("user-name-edit").value.toLowerCase().trim().replace(/\s+/g, '_');
    const newDescription = document.getElementById("description").value.trim();
    let newPermissions = {};
    document.querySelectorAll(".chk-permission").forEach(e => {
        newPermissions[e.id.replace("chk-permission", "")] = e.checked;

    });
    const userId = user.id;
    const payload = { username: newUsername, description: newDescription, permissions: newPermissions };

    try {
        const response = await fetch("/api/editUser/" + userId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.valid) return alert("Error: " + data.message);
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user. Please try again later.");
    }
    loadUserList(await getUserList());


    closeModal();
}

const loadColorModal = async () => {
    const existingModal = document.querySelector(".modal-container");
    if (existingModal) existingModal.remove();
    const modalContainer = createElement("div", { class: "modal-container" }, [
        createElement("div", { class: "modal add-color-modal" }, [
            createElement("div", { class: "modal-header" }, [
                createElement("h2", { class: "modal-title" }, ["Ajouter une couleur"])
            ]),
            createElement("div", { class: "modal-body" }, [
                createElement("div", { class: "color-name-container" }, [
                    createElement("label", { for: "color-name-fr" }, ["Nom de la couleur :"]),
                    createElement("input", { type: "text", id: "color-name-fr", name: "color-name-fr", placeholder: "Exemple : Gris anthracite", autocomplete: "off" })
                ]),
                createElement("div", { class: "color-name-container" }, [
                    createElement("label", { for: "color-name-en" }, ["Color name :"]),
                    createElement("input", { type: "text", id: "color-name-en", name: "color-name-en", placeholder: "Example: Anthracite Grey", autocomplete: "off" })
                ]),
                createElement("div", { class: "color-name-container" }, [
                    createElement("label", { for: "color-name-pt" }, ["Nome da cor :"]),
                    createElement("input", { type: "text", id: "color-name-pt", name: "color-name-pt", placeholder: "Exemplo: Cinza antracite", autocomplete: "off" })
                ]),
                createElement("div", { class: "color-ral-container" }, [
                    createElement("label", { for: "color-ral" }, ["Code RAL :"]),
                    createElement("input", { type: "text", id: "color-ral", name: "color-ral", placeholder: "Exemple : RAL7016", autocomplete: "off" })
                ]),
                createElement("div", { class: "color-hex-container" }, [
                    createElement("input", { class: "color-hex-selector", type: "color", id: "color-hex-selector", value: getRandomColor() })
                ]),
                createElement("div", { class: "stock-chk-container" }, [
                    createElement("div", { class: "shinyStock" }, [
                        createElement("label", { for: "shinyStock" }, ["Brillant"]),
                        createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "shinyStock" })
                    ]),
                    createElement("div", { class: "matteStock" }, [
                        createElement("label", { for: "matteStock" }, ["Mat"]),
                        createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "matteStock" })
                    ]),
                    createElement("div", { class: "sandedStock" }, [
                        createElement("label", { for: "sandedStock" }, ["Sablé"]),
                        createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "sandedStock" })
                    ])
                ])
            ]),
            createElement("div", { class: "modal-footer" }, [
                createElement("button", { class: "btn cancel", id: "btn-cancel-add-color" }, ["Annuler"]),
                createElement("button", { class: "btn save modify-disable", id: "btn-save-add-color" }, ["Enregistrer"])
            ])
        ])
    ]);
    document.body.appendChild(modalContainer);
    
    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer) closeModal();
    });

    document.getElementById("btn-cancel-add-color").addEventListener("click", closeModal);

    document.getElementById("btn-save-add-color").addEventListener("click", async () => {
        let colorNameFr = document.getElementById("color-name-fr").value.trim();
        let colorNameEn =document.getElementById("color-name-en").value.trim();
        let colorNamePt =document.getElementById("color-name-pt").value.trim();
        const colorRal = document.getElementById("color-ral").value.trim().toUpperCase();
        const colorHex = document.getElementById("color-hex-selector").value;
        const shiny_stock = document.getElementById("shinyStock").checked ? 1 : 0;
        const matte_stock = document.getElementById("matteStock").checked ? 1 : 0;
        const sanded_stock = document.getElementById("sandedStock").checked ? 1 : 0;


        if (colorNameFr.length < 3 && colorNameEn.length < 3 && colorNamePt.length < 3) return alert("Le nom de la couleur ne peut pas être vide dans toutes les langues.");
        
        if (colorNameEn.length < 3) {
            if (colorNameFr.length >= 3) colorNameEn = colorNameFr;
            else if (colorNamePt.length >= 3) colorNameEn = colorNamePt;
        }
        if (colorNamePt.length < 3) {
            if (colorNameFr.length >= 3) colorNamePt = colorNameFr;
            else if (colorNameEn.length >= 3) colorNamePt = colorNameEn;
        }
        if (colorNameFr.length < 3) {
            if (colorNamePt.length >= 3) colorNameFr = colorNamePt;
            else if (colorNameEn.length >= 3) colorNameFr = colorNameEn;
        }

        console.log({ fr: colorNameFr, en: colorNameEn, pt: colorNamePt, ral: colorRal, hex: colorHex, stock: { shiny_stock, matte_stock, sanded_stock } });

        try {
            const response = await fetch("/api/colors/addColor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    nameFr: colorNameFr,
                    nameEn: colorNameEn,
                    namePt: colorNamePt,
                    ral: colorRal,
                    hex: colorHex,
                    stock: { shiny_stock, matte_stock, sanded_stock }
                })
            });
            const data = await response.json();
            if (!data.valid) return alert("Erreur : " + data.message);
            alert("Couleur ajoutée avec succès.");
            closeModal();

        } catch (error) {
            console.error("Error adding color:", error);
            alert("échec de l'ajout de la couleur.");
            return;
        }
    });


}

document.getElementById("btn-addColor").addEventListener("click", loadColorModal);



const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
}