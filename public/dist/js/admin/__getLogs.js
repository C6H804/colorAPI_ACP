export const getLogs = async () => {
    try {
        const response = await fetch("/api/logs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching logs:", error);
        alert("Failed to fetch logs. Please try again later.");
        return [];
    }
};