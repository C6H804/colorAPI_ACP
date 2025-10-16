export const fetchLastUpdate = async () => {
    try {
        const token = window.localStorage.getItem("token");
        const response = await fetch("../api/colors/lastUpdate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + token
            }
        });
        const data = await response.json();
        if (data.valid) {
            return data;
        } else {
            console.error("Invalid response:", data.message);
            return { valid: false, message: "Erreur lors de la récupération des données de la dernière mise à jour" };
        }
    } catch (error) {
        console.error("Error fetching last update:", error);
    }
};