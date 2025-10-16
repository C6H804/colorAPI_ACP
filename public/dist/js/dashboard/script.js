import { Auth } from "../components/_Auth.js";
import { getPermissions } from "./__getPermissions.js";
import { updateColorTable } from "./__updateColorTable.js";
import { fetchColors } from "./__fetchColors.js";
import { closeModal } from "./__closeModal.js";

let permissions = false;
window.modal = false;
const upPageBtn = document.getElementById("upPageBtn");
let prevSearch = '';

const init = async () => {
    const isAuth = await Auth();
    if (!isAuth.valid) window.location.href = "../index.html";
    let colors = await fetchColors("");


    const lang = navigator.language.slice(0, 2);
    let filter = document.getElementById("filterSelect").value;
    let search = document.getElementById("searchInput").value;
    
    permissions = await getPermissions(isAuth.value.permissions);

    updateColorTable(filter, lang, search, permissions);
    if (permissions === "admin" || permissions === "moderator") document.querySelector(".admin-button").classList.remove("hide");


    document.getElementById("filterSelect").addEventListener("change", async (e) => {
        filter = e.target.value;
        updateColorTable(filter, lang, search, permissions);
    });

    document.getElementById("searchInput").addEventListener("input", async (e) => {
        search = e.target.value;
        if (search.length > prevSearch.length || !search.startsWith(prevSearch))
            updateColorTable(filter, lang, search, permissions);
        prevSearch = search;
    });
}
init();

document.getElementById("btn-logout").addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.href = "../index.html";
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && window.modal) closeModal();
});

document.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        upPageBtn.classList.remove("btn-hide");
    } else {
        upPageBtn.classList.add("btn-hide");
    }
});

upPageBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});