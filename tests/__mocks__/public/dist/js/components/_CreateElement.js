/**
 * Mock de la fonction createElement pour les tests
 */

export const createElement = jest.fn((tag, attrs = {}, children = []) => {
    const element = document.createElement(tag);
    
    // Appliquer les attributs
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'style') {
            element.setAttribute('style', value);
        } else if (key === 'class') {
            element.className = value;
        } else if (key === 'onclick') {
            element.addEventListener('click', value);
        } else if (key === 'checked' && value === 'checked') {
            element.checked = true;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Ajouter les enfants
    children.forEach(child => {
        if (typeof child === 'string') {
            element.textContent += child;
        } else if (child && typeof child === 'object' && child.nodeType) {
            element.appendChild(child);
        }
    });
    
    return element;
});