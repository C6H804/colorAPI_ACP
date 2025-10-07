/**
 * Configuration Jest pour les tests frontend
 * 
 * Ce fichier configure l'environnement de test pour les fonctions JavaScript
 * utilisées dans l'interface utilisateur (frontend).
 */

// Configuration des mocks globaux pour l'environnement frontend
global.console = {
    ...console,
    // Supprimer les logs de console pendant les tests
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn() // Masquer les erreurs attendues dans les tests
};

// Mock du localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    },
    writable: true
});

// Mock du navigator
Object.defineProperty(window, 'navigator', {
    value: {
        language: 'fr-FR',
        languages: ['fr-FR', 'fr', 'en-US', 'en']
    },
    writable: true
});

// Mock de window.alert et window.confirm
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Mock de window.scrollTo
global.scrollTo = jest.fn();

// Mock de fetch global
global.fetch = jest.fn();

// Configuration par défaut des réponses fetch
beforeEach(() => {
    global.fetch.mockClear();
    global.localStorage.getItem.mockReturnValue('mock-token');
    global.alert.mockClear();
    global.confirm.mockReturnValue(true);
});

// Nettoyage après chaque test
afterEach(() => {
    // Nettoyer le DOM
    document.body.innerHTML = '';
    
    // Reset des variables globales
    if (typeof window !== 'undefined') {
        window.modal = false;
    }
    
    // Nettoyer les timers
    jest.clearAllTimers();
});