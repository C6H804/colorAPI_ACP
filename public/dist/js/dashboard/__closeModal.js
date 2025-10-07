export const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("modal-close-bg");
    document.querySelector(".modal-color").classList.add("modal-close");

    modalContainer.addEventListener("animationend", () => {
        modalContainer.remove();
        document.querySelectorAll(".modal-container").forEach(e => e.remove());
        // Note: la variable modal sera gérée dans dashboard.js
        window.modal = false;
    });
};