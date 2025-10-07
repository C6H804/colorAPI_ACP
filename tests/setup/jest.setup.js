// Configuration globale pour Jest
require('dotenv').config();

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Configuration de la base de données de test (si nécessaire)
process.env.DB_HOST = process.env.TEST_DB_HOST || process.env.DB_HOST;
process.env.DB_USERNAME = process.env.TEST_DB_USERNAME || process.env.DB_USERNAME;
process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD;
process.env.DB_DATABASE = process.env.TEST_DB_DATABASE || process.env.DB_DATABASE + '_test';

// Timeout global pour les tests
jest.setTimeout(10000);

// Configuration globale des mocks si nécessaire
beforeAll(() => {
  // Setup global avant tous les tests
});

afterAll(() => {
  // Cleanup global après tous les tests
});