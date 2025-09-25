const Auth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    const result = await response.json();
    return result.valid;
}
export { Auth };