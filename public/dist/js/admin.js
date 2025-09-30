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
            createElement("div", { class: "username" }, [e.username]),
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

const changeUser = (id) => {
    console.log("Change user " + id);
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


init();