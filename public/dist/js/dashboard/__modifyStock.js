import { closeModal } from "./__closeModal.js";
import { updateColorTable } from "./__updateColorTable.js";

export const modifyStock = async (id, permissions) => {
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

    updateColorTable(document.getElementById("filterSelect").value, navigator.language.slice(0, 2), document.getElementById("searchInput").value, permissions);
};