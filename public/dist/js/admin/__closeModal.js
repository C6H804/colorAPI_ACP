export const closeModal = () => {
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("modal-close-bg");
    document.querySelector(".modal").classList.add("modal-close");

    const modal = document.querySelector(".modal-container");
    modalContainer.addEventListener("animationend", () => {
        modalContainer.remove();
        document.querySelectorAll(".modal-container").forEach(e => e.remove());
    });
};