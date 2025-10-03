const Auth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    const result = await response.json();
    if (!result.valid) return window.location.href = "/index.html";
    return result;
}
export { Auth };