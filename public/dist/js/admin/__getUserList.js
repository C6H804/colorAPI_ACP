export const getUserList = async () => {
    try {
        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching user list:", error);
        alert("Failed to fetch user list. Please try again later.");
        return [];
    }
};