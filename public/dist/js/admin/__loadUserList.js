import { createElement } from "../components/_CreateElement.js";
import { loadModalAddUser } from "./__loadModalAddUser.js";
import { changeUser } from "./__changeUser.js";

export const loadUserList = async (userList) => {
    const userListContainer = document.getElementById("user-list-container");
    userListContainer.innerHTML = "";
    userList.forEach(e => {
        const user = createElement("div", { class: "user", id: "user" + e.id }, [
            createElement("div", { class: "username" }, [e.username]),
            createElement("div", { class: "description" }, [e.description]),
            createElement("div", { class: "last-login" }, [new Date(e.last_connection).toLocaleString()])
        ]);
        user.addEventListener("click", () => changeUser(e.id));
        userListContainer.appendChild(user);
    });
    userListContainer.appendChild(createElement("div", { class: "add-user-container" }, [
        createElement("button", { class: "add-user btn", id: "add-user-btn" }, ["+"])
    ]));
    document.getElementById("add-user-btn").addEventListener("click", loadModalAddUser);
};