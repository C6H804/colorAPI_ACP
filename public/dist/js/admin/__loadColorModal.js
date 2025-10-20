import { createElement } from "../components/_CreateElement.js";

const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("modal-close-bg");
    document.querySelector(".modal").classList.add("modal-close");

    const modal = document.querySelector(".modal-container");
    modalContainer.addEventListener("animationend", () => {
        modalContainer.remove();
        document.querySelectorAll(".modal-container").forEach(e => e.remove());
    });
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
};

export const loadColorModal = async () => {
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
                    createElement("div", { class: "matteStock" }, [
                        createElement("label", { for: "matteStock" }, ["Mât"]),
                        createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "matteStock" })
                    ]),
                    createElement("div", { class: "shinyStock" }, [
                        createElement("label", { for: "shinyStock" }, ["Brillant"]),
                        createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "shinyStock" })
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
        let colorRal = document.getElementById("color-ral").value.trim().toUpperCase().replace(" ", "");
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
};