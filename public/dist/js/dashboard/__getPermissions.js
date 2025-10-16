export const getPermissions = async (perms) => {
    console.log(perms);
    if (perms.find(e => e.name === "admin")) return "admin";
    if (perms.find(e => e.name === "moderator")) return "moderator";
    if (perms.find(e => e.name === "color manager")) return "color manager";
    if (perms.find(e => e.name === "visitor")) return "visitor";
    return "none";
};