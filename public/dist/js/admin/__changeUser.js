import { getUserData } from "./__getUserData.js";
import { getPermissions } from "./__getPermissions.js";
import { getUserPermissions } from "./__getUserPermissions.js";
import { loadModalEdit } from "./__loadModalEdit.js";

export const changeUser = async (id) => {
    const user = await getUserData(id);
    if (!user) return alert("User not found");

    const permissions = await getPermissions();
    if (permissions.length === 0) return alert("Failed to fetch permissions");

    const userPermissions = await getUserPermissions(user.id);

    loadModalEdit(user, permissions, userPermissions);
};