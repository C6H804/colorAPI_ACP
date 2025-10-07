import { createElement } from "../components/_CreateElement.js";
import { calculateTimePassed } from "./__calculateTimePassed.js";

export const loadLogs = (logs, lang) => {
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
};