import { fetchLastUpdate } from "./__fetchLastUpdate.js";
import { calculateTimePassed } from "../components/__calculateTimePassed.js";

const dictionary = {
    fr: {
        color: "Couleur : ...",
        loading: "Chargement...",
    },
    en: {
        color: "Color : ...",
        loading: "Loading...",
    },
    pt: {
        color: "Cor : ...",
        loading: "Carregando...",
    }
}

export const renderLastUpdate = async (lang = "fr") => {
    let text = dictionary[lang].loading;
    let header = dictionary[lang].color;
    let color = "#3e3e3e";
    let title = dictionary[lang].loading;
    // 2025-10-15T11:44:02.000Z
    let date = new Date().toLocaleString();
    try {
        const lastUpdateData = await fetchLastUpdate();
        if (!lastUpdateData.valid) {
            text = lastUpdateData.message;
        } else {
            console.log(lastUpdateData);
            text = "";
            const oldValues = [lastUpdateData.value.change_description[41], lastUpdateData.value.change_description[50], lastUpdateData.value.change_description[61]];
            const newValues = [lastUpdateData.value.change_description[91], lastUpdateData.value.change_description[100], lastUpdateData.value.change_description[111]];
            if (oldValues[0] !== newValues[0]) text += "Mat : " + oldValues[0] + " → " + newValues[0] + " | ";
            if (oldValues[1] !== newValues[1]) text += "Brillant : " + oldValues[1] + " → " + newValues[1] + " | ";
            if (oldValues[2] !== newValues[2]) text += "Sablée : " + oldValues[2] + " → " + newValues[2] + " | ";
            text = text.replace(/undefined/g, "0");
            text = text.replace(/0/g, "hors stock");
            text = text.replace(/1/g, "disponible");
            text = text.slice(0, -3);

            header = lastUpdateData.value.value + " - ";
            switch (lang) {
                case "fr":
                    header += lastUpdateData.value.name_fr;
                    break;
                case "en":
                    header += lastUpdateData.value.name_en;
                    break;
                case "pt":
                    header += lastUpdateData.value.name_pt;
                    break;
            }
            color = '#' + lastUpdateData.value.color;
            title = calculateTimePassed(lastUpdateData.value.date, lang);
        }
    } catch (error) {
        text = "Erreur lors de la récupération des données de la dernière mise à jour";
    }
    document.getElementById("lastUpdateName").innerText = header;
    document.getElementById("lastUpdateText").innerText = text;
    document.getElementById("colorUpdated-value").style.backgroundColor = color;
    document.querySelector(".lastUpdate-container").title = title;
};