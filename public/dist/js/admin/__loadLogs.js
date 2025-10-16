import { createElement } from "../components/_CreateElement.js";
import { calculateTimePassed } from "../components/__calculateTimePassed.js";

export const loadLogs = (logs, lang) => {
    const logsContainer = document.getElementById("logs-container");
    logs.forEach(e => {
        let message = "";
        let ral = "inconnu";

        switch (e.description) {
            case "modification des stocks d'une couleur":
                {
                    message = "stock changé - ";
                    const oldValues = [e.change_description[41], e.change_description[50], e.change_description[61]];
                    const newValues = [e.change_description[91], e.change_description[100], e.change_description[111]];
                    if (oldValues[0] !== newValues[0]) message += "Mat : " + oldValues[0] + " → " + newValues[0] + " | ";
                    if (oldValues[1] !== newValues[1]) message += "Brillant : " + oldValues[1] + " → " + newValues[1] + " | ";
                    if (oldValues[2] !== newValues[2]) message += "Sablée : " + oldValues[2] + " → " + newValues[2] + " | ";
                    message = message.slice(0, -3);
                    ral = e.value;
                }
                break;
            case "ajout d'une nouvelle couleur":
                {
                    message = "nouvelle couleur : ";
                    message += e.change_description.replace(" Ajout de la couleur ", "").split(" / ")[0] + " - "
                        + e.change_description.split(" / ")[1] + " - " + e.change_description.split(" / ")[2].split(" - ")[0];
                    ral = e.change_description.split(" - ")[1];
                }
                break;
            case "suppression d'une couleur":
                {
                    console.log(e);
                    message = "couleur supprimée : " + e.change_description.replace("Suppression de la couleur ", "");
                    ral = e.value;
                }
                break;
            default:
                {
                    message = "log de type inconnue : " + e.description;
                    ral = e.value;
                }
        }
        const timePassed = Date.now() - new Date(e.date).getTime();
        const log = createElement("div", { class: "log", title: calculateTimePassed(e.date, lang) }, [
            createElement("div", { class: "log-user" }, [e.username]),
            createElement("div", { class: "log-date", }, [new Date(e.date).toLocaleString()]),
            createElement("div", { class: "log-color" }, [ral]),
            createElement("div", { class: "log-change" }, [message])
        ]);
        logsContainer.appendChild(log);
    });
};