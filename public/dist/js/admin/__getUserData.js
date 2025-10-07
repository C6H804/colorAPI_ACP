import { getUserList } from "./__getUserList.js";

export const getUserData = async (userId) => {
    const userList = await getUserList();
    if (userList.length === 0) return [];
    const user = userList.find(e => e.id === userId);
    if (!user) {
        console.error("User not found:", userId);
        return null;
    }
    return user;
};