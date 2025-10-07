import { getUserList } from "./__getUserList.js";
import { loadUserList } from "./__loadUserList.js";
import { closeModal } from "./__closeModal.js";

export const saveEditData = async (user) => {
    const newUsername = document.getElementById("user-name-edit").value.toLowerCase().trim().replace(/\s+/g, '_');
    const newDescription = document.getElementById("description").value.trim();
    let newPermissions = {};
    document.querySelectorAll(".chk-permission").forEach(e => {
        newPermissions[e.id.replace("chk-permission", "")] = e.checked;

    });
    const userId = user.id;
    const payload = { username: newUsername, description: newDescription, permissions: newPermissions };

    try {
        const response = await fetch("/api/editUser/" + userId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.valid) return alert("Error: " + data.message);
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user. Please try again later.");
    }
    loadUserList(await getUserList());

    closeModal();
};