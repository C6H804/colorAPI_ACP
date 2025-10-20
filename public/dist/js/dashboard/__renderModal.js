import { createElement } from "../components/_CreateElement.js";
import { closeModal } from "./__closeModal.js";
import { modifyStock } from "./__modifyStock.js";
import { updateColorTable } from "./__updateColorTable.js";

export const renderModal = (id, value, color, name, type, shiny, matte, sanded, permissions) => {
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
                createElement("div", { class: "matteStock" }, [
                    createElement("label", { for: "matteStock" }, ["Mât"]),
                    createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "matteStock", ...(matte === 1 ? { checked: "checked", } : {}) })
                ]),
                createElement("div", { class: "shinyStock" }, [
                    createElement("label", { for: "shinyStock" }, ["Brillant"]),
                    createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "shinyStock", ...(shiny === 1 ? { checked: "checked" } : {}) })
                ]),
                createElement("div", { class: "sandedStock" }, [
                    createElement("label", { for: "sandedStock" }, ["Sablé"]),
                    createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "sandedStock", ...(sanded === 1 ? { checked: "checked" } : {}) })
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
    if (permissions !== "admin" && permissions !== "color manager" && permissions !== "moderator") document.querySelectorAll(".modify-disable").forEach(e => e.setAttribute("disabled", "disabled"));
    document.querySelector(".btn.cancel").addEventListener("click", closeModal);
    document.querySelector(".btn.save").addEventListener("click", async () => modifyStock(id, permissions));

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