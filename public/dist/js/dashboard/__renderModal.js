import { createElement } from "../components/_CreateElement.js";
import { closeModal } from "./__closeModal.js";
import { modifyStock } from "./__modifyStock.js";
import { updateColorTable } from "./__updateColorTable.js";

export const renderModal = (id, value, color, name, type, shiny, matte, sanded, permissions, lang = "fr") => {
    if (window.modal) return;
    window.modal = true;
    console.log(id, color, name, type, shiny, matte, sanded);
    const deleteButton = permissions === "admin" || permissions === "moderator" ? createElement("button", { class: "btn delete-btn", id: "delete-color" }, ["Supprimer"]) : "";

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) closeModal();
    });

    // convert color (#rrggbb) into decimal value of rgb like 120 20 255

    const rgb = type === "RAL" ? color.match(/\w\w/g).map(x => parseInt(x, 16)) : [0, 0, 0];

    let stock = {
        shiny: shiny,
        matte: matte,
        sanded: sanded
    };


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
    }


    const icons = ["../dist/img/Cross.svg", "../dist/img/Check.svg", "../dist/img/Timer.svg"];

    const disabled = permissions === "admin" || permissions === "color manager" ? "" : "disabled";

    const modalDiv = createElement("div", { class: "modal-color" }, [
        createElement("div", { class: "modal-header" }, [
            createElement("h2", {}, [name]),
            createElement("div", { class: "color-info" }, [
                createElement("div", { class: "label-color-container" }, [
                    createElement("label", { class: "label-color-ral" }, [type === "RAL" ? "RAL" + value : value]),
                    createElement("label", { class: "label-color-rgb" }, [`rgb (${rgb[0]}, ${rgb[1]}, ${rgb[2]})`]),
                    createElement("label", { class: "label-color-hex" }, [color !== "#" ? color : "N/A"])
                ]),
                createElement("span", {
                    class: "color-btn", style: `background-color: ${color};`, onclick: () => {
                        if (!permissions) return;
                        console.log("change color");
                    }
                })
            ]),
        ]),
        createElement("div", { class: "modal-body" }, [
            createElement("div", { class: "stock-chk-container", id: "modalForm" }, [
                createElement("div", { class: "matteStock", id: "matteStockDiv" }, [
                    createElement("label", { for: "matteStock" }, [dictionary[lang].matte]),
                    // createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "matteStock", ...(matte === 1 ? { checked: "checked", } : {}) })
                    createElement("img", { src: icons[stock.matte], class: "status-icon-modal", id: "icon-matte" })
                ]),
                createElement("div", { class: "shinyStock", id: "shinyStockDiv" }, [
                    createElement("label", { for: "shinyStock" }, [dictionary[lang].shiny]),
                    // createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "shinyStock", ...(shiny === 1 ? { checked: "checked" } : {}) })
                    createElement("img", { src: icons[stock.shiny], class: "status-icon-modal", id: "icon-shiny" })
                ]),
                createElement("div", { class: "sandedStock", id: "sandedStockDiv" }, [
                    createElement("label", { for: "sandedStock" }, [dictionary[lang].sanded]),
                    // createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "sandedStock", ...(sanded === 1 ? { checked: "checked" } : {}) })
                    createElement("img", { src: icons[stock.sanded], class: "status-icon-modal", id: "icon-sanded" })
                ])
            ]),
            createElement("div", { class: "modal-actions" }, [
                createElement("button", { class: "btn cancel" }, ["Annuler"]),
                createElement("button", { class: "btn save modify-disable" }, ["Enregistrer"]),
                deleteButton
            ])
        ])
    ]);



    modalContainer.appendChild(modalDiv);
    document.body.appendChild(modalContainer);

    document.querySelectorAll(".status-icon-modal").forEach(icon => {
        icon.addEventListener("click", (e) => {
            stock[e.target.id.replace("icon-", "")] = (stock[e.target.id.replace("icon-", "")] + 1) % 3;
            e.target.src = icons[stock[e.target.id.replace("icon-", "")]];
        });
    });

    if (permissions !== "admin" && permissions !== "color manager" && permissions !== "moderator") document.querySelectorAll(".modify-disable").forEach(e => e.setAttribute("disabled", "disabled"));

    document.querySelector(".btn.cancel").addEventListener("click", closeModal);
    document.querySelector(".btn.save").addEventListener("click", async () => modifyStock(id, permissions, stock));

    if (deleteButton) {
        document.getElementById("delete-color").addEventListener("click", async () => {
            if (confirm("Êtes-vous sûr de vouloir supprimer cette couleur ? Cette action est irréversible.") && (permissions === "admin" || permissions === "moderator")) {
                try {
                    const response = await fetch("/api/colors/deleteColor/" + id, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    });
                    const data = await response.json();
                    console.log(data);
                    if (!data.valid) return alert("Erreur lors de la suppression de la couleur : " + data.message);
                    alert("Couleur supprimée avec succès");
                    updateColorTable(document.getElementById("filterSelect").value, navigator.language.slice(0, 2), document.getElementById("searchInput").value, permissions);
                    return closeModal();

                } catch (error) {
                    console.error("Error deleting color:", error);
                    alert("Erreur lors de la suppression de la couleur. Veuillez réessayer plus tard.");
                }
            }
        });
    }
};