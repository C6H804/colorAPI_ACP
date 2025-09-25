const createElement = (type, attributes = {}, content = []) => {
    const element = document.createElement(type);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    content.forEach(item => {
        if (typeof item === "string") {
            element.innerHTML += item;
        } else if (item instanceof Node) {
            element.appendChild(item);
        }
    });
    return element;
}

export { createElement };

