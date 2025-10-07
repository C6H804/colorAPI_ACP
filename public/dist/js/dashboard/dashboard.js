import { Auth } from "../components/_Auth.js";
import { createElement } from "../components/_CreateElement.js";

const getPermissions = async (perms) => {
    console.log(perms);
    if (perms.find(e => e.name === "admin")) return "admin";
    if (perms.find(e => e.name === "color manager")) return "color manager";
    if (perms.find(e => e.name === "visitor")) return "visitor";
    return "none";
};

let permissions = false;
let modal = false;
const upPageBtn = document.getElementById("upPageBtn");

const init = async () => {
    const isAuth = await Auth();
    if (!isAuth.valid) window.location.href = "../index.html";
    let colors = await fetchColors("");

    const lang = navigator.language.slice(0, 2);
    let filter = document.getElementById("filterSelect").value;
    let search = document.getElementById("searchInput").value;
    updateColorTable(filter, lang, search);
    console.log(colors); // TEMP
    permissions = await getPermissions(isAuth.value.permissions);
    if (permissions === "admin") document.querySelector(".admin-button").classList.remove("hide");


    document.getElementById("filterSelect").addEventListener("change", async (e) => {
        filter = e.target.value;
        updateColorTable(filter, lang, search);
    });

    document.getElementById("searchInput").addEventListener("input", async (e) => {
        search = e.target.value;
        updateColorTable(filter, lang, search);
    });
}
init();


const updateColorTable = async (filter, lang, search = "") => {
    const colors = await fetchColors(filter);
    const filteredColors = searchInColors(colors.colors, search);
    loadColorsTable(filteredColors, lang);
}

const fetchColors = async (filter) => {
    try {
        const response = await fetch("/api/colors/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ filter: filter })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching colors:", error);
        alert("Erreur lors de la récupération des couleurs. Veuillez réessayer plus tard.");
    }
    return [];
}

const loadColorsTable = (colors, lang = "en") => {
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
        colors.forEach(e => {
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

            const available = ["❌", "✔️"];

            const row = createElement("div", { class: `table-row ${type}`, title: title }, [
                createElement("div", { class: "row-item color", style: `background-color: ${color};` }),
                createElement("div", { class: "row-item value" }, [value]),
                createElement("div", { class: "row-item name mobile" }, [name]),
                createElement("div", { class: "row-item stock shiny available" + b }, [available[b]]),
                createElement("div", { class: "row-item stock matte available" + m }, [available[m]]),
                createElement("div", { class: "row-item stock sanded available" + s }, [available[s]])
            ]);
            row.addEventListener("click", () => {
                renderModal(e.id, value, color, name, type, b, m, s);
            });

            tableBody.appendChild(row);
        });
    }
}

const searchInColors = (colors, search) => {
    return colors.filter(e => {
        if (e.type === "OTHER") {
            return e.name_fr.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_en.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_pt.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.value.toLowerCase().startsWith(search.toLowerCase().trim());
        } else {
            return e.name_fr.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_en.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_pt.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.value.toLowerCase().slice(3).startsWith(search.toLowerCase().trim());
        }
    });
}

const renderModal = (id, value, color, name, type, shiny, matte, sanded) => {
    if (modal) return;
    modal = true;
    console.log(id, color, name, type, shiny, matte, sanded);
    const deleteButton = permissions === "admin" ? createElement("button", { class: "btn delete-btn", id: "delete-color" }, [
        createElement("img", { src: "../../img/trash-fill.svg", alt: "Delete", title: "Supprimer la couleur" })
    ]) : "";

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) closeModal();
    });

    const disabled = permissions === "admin" || permissions === "color manager" ? "" : "disabled";

    const modalDiv = createElement("div", { class: "modal-color" }, [
        createElement("div", { class: "modal-header" }, [
            createElement("h2", {}, [name]),
            createElement("div", { class: "color-info" }, [
                createElement("label", { class: "label-color" }, [type === "RAL" ? "RAL" + value : value]),
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
                createElement("div", { class: "shinyStock" }, [
                    createElement("label", { for: "shinyStock" }, ["Brillant"]),
                    createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "shinyStock", ...(shiny === 1 ? { checked: "checked", } : {}) })
                ]),
                createElement("div", { class: "matteStock" }, [
                    createElement("label", { for: "matteStock" }, ["Mat"]),
                    createElement("input", { class: "checkbox modify-disable", type: "checkbox", id: "matteStock", ...(matte === 1 ? { checked: "checked" } : {}) })
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
    if (permissions !== "admin" && permissions !== "color manager") document.querySelectorAll(".modify-disable").forEach(e => e.setAttribute("disabled", "disabled"));
    document.querySelector(".btn.cancel").addEventListener("click", closeModal);
    document.querySelector(".btn.save").addEventListener("click", async () => modifyStock(id));


    document.getElementById("delete-color").addEventListener("click", async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette couleur ? Cette action est irréversible.") && permissions === "admin") {
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
                updateColorTable(document.getElementById("filterSelect").value, navigator.language.slice(0, 2), document.getElementById("searchInput").value);
                return closeModal();

            } catch (error) {
                console.error("Error deleting color:", error);
                alert("Erreur lors de la suppression de la couleur. Veuillez réessayer plus tard.");
            }
        }
    });
}

const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("modal-close-bg");
    document.querySelector(".modal-color").classList.add("modal-close");

    modalContainer.addEventListener("animationend", () => {
        console.log("close modal");
        modalContainer.remove();
        document.querySelectorAll(".modal-container").forEach(e => e.remove());
        modal = false;
    });
}

const modifyStock = async (id) => {
    if (!permissions) return;
    const shiny = document.getElementById("shinyStock").checked ? 1 : 0;
    const matte = document.getElementById("matteStock").checked ? 1 : 0;
    const sanded = document.getElementById("sandedStock").checked ? 1 : 0;
    try {
        const response = await fetch("/api/colors/modifyStock/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ shiny_stock: shiny, matte_stock: matte, sanded_stock: sanded })
        });
        const data = await response.json();
        if (!data.valid) {
            console.error("Invalid response:", data);
        }
    } catch (error) {
        console.error("Error modifying stock:", error);
    }
    closeModal();

    updateColorTable(document.getElementById("filterSelect").value, navigator.language.slice(0, 2), document.getElementById("searchInput").value);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) closeModal();
});

document.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        upPageBtn.classList.remove("btn-hide");
    } else {
        upPageBtn.classList.add("btn-hide");
    }
});

upPageBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});