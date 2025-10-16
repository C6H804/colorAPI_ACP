import { createElement } from "../components/_CreateElement.js";
import { Auth } from "../components/_Auth.js";
import { getUserList } from "./__getUserList.js";
import { loadUserList } from "./__loadUserList.js";
import { loadModalAddUser } from "./__loadModalAddUser.js";
import { getLogs } from "./__getLogs.js";
import { loadLogs } from "./__loadLogs.js";
import { changeUser } from "./__changeUser.js";
import { getPermissions } from "./__getPermissions.js";
import { getUserPermissions } from "./__getUserPermissions.js";
import { getUserData } from "./__getUserData.js";
import { loadModalEdit } from "./__loadModalEdit.js";
import { loadColorModal } from "./__loadColorModal.js";
import { closeModal } from "./__closeModal.js";

const init = async () => {
    const auth = await Auth();
    const lang = navigator.language.slice(0, 2) || "en".slice(0, 2)
    loadUserList(await getUserList());
    loadLogs(await getLogs(), lang);
};

init();


document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

document.getElementById("btn-addColor").addEventListener("click", loadColorModal);

