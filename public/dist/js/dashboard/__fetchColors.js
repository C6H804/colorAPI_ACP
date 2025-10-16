export const fetchColors = async (filter) => {
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
};