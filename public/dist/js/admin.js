import { createElement } from "./components/_CreateElement.js";


const init = async () => {
    const lang = navigator.language.slice(0, 2) || "en".slice(0, 2)
    loadUserList(await getUserList());
    loadLogs(await getLogs(), lang);
};

const getUserList = async () => {
    try {
        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        console.log(data.value);
        return data.value;
    } catch (error) {
        console.error("Error fetching user list:", error);
        alert("Failed to fetch user list. Please try again later.");
        return [];
    }
}

const loadUserList = async (userList) => {
    const userListContainer = document.getElementById("user-list-container");
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
        createElement("button", { class: "add-user btn" }, ["+"])
    ]));
}

const addUser = () => {
    console.log("Add user");
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
        console.log(data.value);
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
    console.log("Change user " + id);

    const user = await getUserData(id);
    if (!user) return alert("User not found");
    console.log(user);

    const permissions = await getPermissions();
    if (permissions.length === 0) return alert("Failed to fetch permissions");
    console.log(permissions);

    const userPermissions = await getUserPermissions(user.id);
    if (userPermissions.length === 0) return alert("Failed to fetch user permissions");
    console.log(userPermissions);

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
        console.log(checked);
        const permissionElement = createElement("div", { class: "permission", id: "permission" + e.id }, [
            createElement("label", { for: "chk-permission" + e.id }, [e.name, " : "]),
            createElement("label", { class: "permission-description", for: "chk-permission" + e.id }, [e.description]),
            checked ? createElement("input", { type: "checkbox", class: "chk-permission", id: "chk-permission" + e.id, name: "chk-permission" + e.id, checked: "checked" }) :
            createElement("input", { type: "checkbox", class: "chk-permission", id: "chk-permission" + e.id, name: "chk-permission" + e.id }),
            createElement("label", { for: "chk-permission" + e.id, class: "switch" })
        ]);
        permissionElements.appendChild(permissionElement);
    });


    const modalContainer = createElement("div", { class: "modal-container" }, [
        createElement("div", { class: "modal edit-user-modal" }, [
            createElement("div", { class: "modal-header" }, [
                createElement("input", { type: "text", id: "user-name-edit", class: "modal-title modal-edit-username", value: user.username })
            ]),
            createElement("div", { class: "modal-body" }, [
                createElement("div", { class: "description-container" }, [
                    createElement("label", { for: "description" }, ["Description :"]),
                    createElement("textarea", { id: "description", name: "description", rows: "4", cols: "50" }, [user.description])
                ]),
                createElement("div", { class: "permissions-container" }, [
                    createElement("h3", {}, ["Permissions : "]),
                    permissionElements
                ])
            ]
            ),
            createElement("div", { class: "modal-footer" }, [
                createElement("button", { class: "btn btn-cancel", id: "cancel-btn" }, ["Annuler"]),
                createElement("button", { class: "btn btn-save", id: "save-btn" }, ["Enregistrer"])
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

    document.getElementById("save-btn").addEventListener("click", async () => {
        const newUsername = document.getElementById("user-name-edit").value;
        const newDescription = document.getElementById("description").value;
        let newPermissions = {};
        document.querySelectorAll(".chk-permission").forEach(e => {
            newPermissions[e.id.replace("chk-permission", "")] = e.checked;

        });
        console.log("New username:", newUsername);
        console.log("New description:", newDescription);
        console.log("New permissions:", newPermissions);
    });

}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

const closeModal = () => {
    const modal = document.querySelector(".modal-container");
    if (modal) modal.remove();
    // TODO add animation
}



init();