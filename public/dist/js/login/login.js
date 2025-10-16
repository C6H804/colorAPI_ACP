const init = async () => {
    if (localStorage.getItem("token")) {
        window.location.href = "./pages/dashboard.html";
    }
}

init();
const login = async (username, password) => {
    const response = await fetch("api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    return response.json()
}


const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = event.target.username.value.trim().toLowerCase();
    const password = event.target.password.value;
    const result = await login(username, password);
    if (result.valid === true) {
        localStorage.setItem("token", result.value);
        window.location.href = "./pages/dashboard.html";
    } else {
        alert(result.message);
        window.location.reload();
    }
});