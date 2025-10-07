// Données de test pour les utilisateurs
const testUsers = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'adminpassword123',
    permissions: ['admin', 'visitor', 'modify_colors']
  },
  visitor: {
    id: 2,
    username: 'visitor',
    password: 'visitorpassword123',
    permissions: ['visitor']
  },
  modifier: {
    id: 3,
    username: 'colormodifier',
    password: 'modifierpassword123',  
    permissions: ['visitor', 'modify_colors']
  }
};

// Données de test pour les couleurs
const testColors = [
  {
    id: 1,
    type: 'RAL',
    name_fr: 'Rouge Cardinal',
    name_en: 'Cardinal Red',
    name_pt: 'Vermelho Cardeal',
    value: 'RAL3000',
    color: '#FF0000',
    shiny_stock: 1,
    matte_stock: 0,
    sanded_stock: 1
  },
  {
    id: 2,
    type: 'RAL',
    name_fr: 'Bleu Ocean',
    name_en: 'Ocean Blue',
    name_pt: 'Azul Oceano',
    value: 'RAL5015',
    color: '#0080FF',
    shiny_stock: 0,
    matte_stock: 1,
    sanded_stock: 0
  }
];

// JWT tokens de test
const testTokens = {
  admin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token',
  visitor: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.visitor-token',
  modifier: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.modifier-token',
  invalid: 'invalid-token'
};

// Réponses d'erreur courantes
const errorResponses = {
  unauthorized: {
    message: 'Unauthorized',
    status: 401
  },
  forbidden: {
    message: 'user lacks required permissions',
    status: 403
  },
  badRequest: {
    message: 'Bad Request',
    status: 400
  },
  serverError: {
    message: 'Server error',
    status: 500
  }
};

module.exports = {
  testUsers,
  testColors,
  testTokens,
  errorResponses
};