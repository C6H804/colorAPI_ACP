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
    const username = event.target.username.value;
    const password = event.target.password.value;
    const result = await login(username, password);
    console.log(result); // TEMP
    if (result.valid === true) {
        localStorage.setItem("token", result.value);
        window.location.href = "./pages/dashboard.html";
    } else {
        alert(result.message);
        window.location.reload();
    }
});