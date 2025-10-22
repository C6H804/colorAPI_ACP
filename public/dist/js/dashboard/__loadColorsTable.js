import { createElement } from "../components/_CreateElement.js";
import { renderModal } from "./__renderModal.js";

export const loadColorsTable = (colors, lang = "en", permissions = false) => {
    const tableBody = document.getElementById("colorsContainer");
    tableBody.innerHTML = "";
    if (colors.length === 0) {

        const message = {
            fr: "Aucune couleur trouvée.",
            en: "No colors found.",
            pt: "Nenhuma cor encontrada."
        }

        tableBody.appendChild(createElement("div", { class: "no-colors empty" }, [message[lang]]));
    } else {

        const stockStatus = ["outOfStock", "inStock", "waitingStock"];

        const dictionary = {
            fr: {
                shiny: "Brillant",
                matte: "Mat",
                sanded: "Sablé",
                outOfStock: "Hors stock",
                inStock: "En stock",
                waitingStock: "Hors stock avec délai",
                message: "Aucune couleur trouvée."
            },
            en: {
                shiny: "Shiny",
                matte: "Matte",
                sanded: "Sanded",
                outOfStock: "Out of stock",
                inStock: "In stock",
                waitingStock: "Out of stock with delay",
                message: "No colors found."
            },
            pt: {
                shiny: "Brilhante",
                matte: "Fosca",
                sanded: "Sable",
                outOfStock: "Fora de estoque",
                inStock: "Em estoque",
                waitingStock: "Fora de estoque com atraso",
                message: "Nenhuma cor encontrada."
            }
        };


        colors.forEach(e => {
            if (e.value === "RAL0000") return; // Ignorer les entrées RAL0000
            const color = '#' + e.color;
            const names = {
                fr: e.name_fr,
                en: e.name_en,
                pt: e.name_pt
            };
            const name = names[lang] || e.name_en;

            const title = e.value + " - " + name;
            const type = e.type;
            const b = e.shiny_stock;
            const m = e.matte_stock;
            const s = e.sanded_stock;
            let value = e.value;
            if (type === "RAL") value = e.value.replace("RAL", "");

            const available = ["cross.svg", "check.svg", "timer.svg"];

            const row = createElement("div", { class: `table-row ${type}`, title: title }, [
                createElement("div", { class: "row-item color", style: `background-color: ${color};` }),
                createElement("div", { class: "row-item value" }, [value]),
                createElement("div", { class: "row-item name mobile" }, [name]),
                createElement("div", { class: "row-item stock matte available" + m }, [
                    createElement("img", { src: "/dist/img/" + available[m], alt: dictionary[lang][stockStatus[m]], title: dictionary[lang][stockStatus[m]], height: "32", width: "32" })
                ]),
                createElement("div", { class: "row-item stock shiny available" + b }, [
                    createElement("img", { src: "/dist/img/" + available[b], alt: dictionary[lang][stockStatus[b]], title: dictionary[lang][stockStatus[b]], height: "32", width: "32" })
                ]),
                createElement("div", { class: "row-item stock sanded available" + s }, [
                    createElement("img", { src: "/dist/img/" + available[s], alt: dictionary[lang][stockStatus[s]], title: dictionary[lang][stockStatus[s]], height: "32", width: "32" })
                ])
            ]);

            row.addEventListener("click", () => {
                renderModal(e.id, value, color, name, type, b, m, s, permissions, lang);
            });

            tableBody.appendChild(row);
        });
    }
};