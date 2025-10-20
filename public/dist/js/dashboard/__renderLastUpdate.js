import { fetchLastUpdate } from "./__fetchLastUpdate.js";
import { calculateTimePassed } from "../components/__calculateTimePassed.js";

const dictionary = {
    fr: {
        color: "Couleur : ...",
        loading: "Chargement...",
        outOfStock: "hors stock",
        available: "disponible",
    },
    en: {
        color: "Color : ...",
        loading: "Loading...",
        outOfStock: "out of stock",
        available: "available",
    },
    pt: {
        color: "Cor : ...",
        loading: "Carregando...",
        outOfStock: "fora de estoque",
        available: "disponível",
    }
}

export const renderLastUpdate = async (lang = "fr") => {
    let text = dictionary[lang].loading;
    let header = dictionary[lang].color;
    let color = "";
    let title = dictionary[lang].loading;
    let date = new Date().toLocaleString();
    try {
        const lastUpdateData = await fetchLastUpdate();
        if (!lastUpdateData.valid) {
            text = lastUpdateData.message;
        } else {
            text = "";
            const oldValues = [lastUpdateData.value.change_description[41], lastUpdateData.value.change_description[50], lastUpdateData.value.change_description[61]];
            const newValues = [lastUpdateData.value.change_description[91], lastUpdateData.value.change_description[100], lastUpdateData.value.change_description[111]];
            if (oldValues[0] !== newValues[0]) text += "Mât : " + oldValues[0] + " → " + newValues[0] + " | ";
            if (oldValues[1] !== newValues[1]) text += "Brillant : " + oldValues[1] + " → " + newValues[1] + " | ";
            if (oldValues[2] !== newValues[2]) text += "Sablée : " + oldValues[2] + " → " + newValues[2] + " | ";
            text = text.replace(/undefined/g, "0");
            text = text.replace(/0/g, dictionary[lang].outOfStock);
            text = text.replace(/1/g, dictionary[lang].available);
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
    const lastUpdateName = document.getElementById("lastUpdateName");
    const lastUpdateText = document.getElementById("lastUpdateText");
    const colorUpdatedValue = document.getElementById("colorUpdated-value");

    lastUpdateName.innerText = header;
    lastUpdateName.classList.add("colorName-spawn");

    lastUpdateText.innerText = text;
    lastUpdateText.classList.add("colorText-spawn");

    colorUpdatedValue.style.backgroundColor = color;
    colorUpdatedValue.classList.add("colorValue-spawn");

    // lastUpdateName.addEventListener("animationend", () => {
    //     lastUpdateName.classList.remove("colorName-spawn");
    //     lastUpdateText.classList.remove("colorText-spawn");
    //     colorUpdatedValue.classList.remove("colorValue-spawn");
    // }, { once: true });

    document.querySelector(".lastUpdate-container").title = title;
};