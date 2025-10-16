// Helpers pour les tests d'API
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock des tokens JWT pour différents types d'utilisateurs
const createMockToken = (userId, permissions = []) => {
  const payload = {
    id: userId,
    username: `user${userId}`,
    permissions: permissions
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret-key', { expiresIn: '1h' });
};

// Tokens pour différents rôles
const mockTokens = {
  admin: createMockToken(1, ['admin', 'visitor', 'modify_colors']),
  visitor: createMockToken(2, ['visitor']),
  modifier: createMockToken(3, ['visitor', 'modify_colors']),
  invalid: 'invalid-token-string'
};

// Données de test pour les utilisateurs
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    description: 'Administrateur système',
    created_at: '2024-01-01T10:00:00Z',
    last_connexion: '2024-10-07T10:00:00Z',
    deleted: 0
  },
  {
    id: 2,
    username: 'visitor',
    description: 'Utilisateur visiteur',
    created_at: '2024-01-02T10:00:00Z',
    last_connexion: '2024-10-06T15:30:00Z',
    deleted: 0
  },
  {
    id: 3,
    username: 'modifier',
    description: 'Modificateur de couleurs',
    created_at: '2024-01-03T10:00:00Z',
    last_connexion: '2024-10-05T12:15:00Z',
    deleted: 0
  }
];

// Données de test pour les couleurs
const mockColors = [
  {
    id: 1,
    type: 'RAL',
    name_fr: 'Rouge Cardinal',
    name_en: 'Cardinal Red',
    name_pt: 'Vermelho Cardeal',
    value: 'RAL3000',
    color: 'FF0000',
    shiny_stock: 1,
    matte_stock: 0,
    sanded_stock: 1,
    deleted: 0
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
    sanded_stock: 0,
    deleted: 0
  }
];

// Données de test pour les permissions
const mockPermissions = [
  { id: 1, name: 'admin', description: 'Accès administrateur complet' },
  { id: 2, name: 'visitor', description: 'Accès en lecture seule' },
  { id: 3, name: 'modify_colors', description: 'Modification des couleurs' }
];

// Données de test pour les logs
const mockLogs = [
  {
    id: 1,
    action: 'COLOR_ADDED',
    user_id: 1,
    timestamp: '2024-10-07T10:00:00Z',
    details: 'Nouvelle couleur RAL3000 ajoutée'
  },
  {
    id: 2,
    action: 'USER_LOGIN',
    user_id: 2,
    timestamp: '2024-10-07T09:30:00Z',
    details: 'Connexion utilisateur visitor'
  }
];

// Helper pour faire des requêtes authentifiées
const authenticatedRequest = (app, method, endpoint, token = mockTokens.admin) => {
  return request(app)[method](endpoint)
    .set('Authorization', `Bearer ${token}`);
};

// Mock des réponses de base de données
const mockDbResponses = {
  // Pour les utilisateurs
  getUserByCredentials: (username, password) => {
    if (username === 'admin' && password === 'adminpassword') {
      return { valid: true, value: mockUsers[0] };
    }
    return { valid: false, message: 'Invalid credentials', status: 401 };
  },

  // Pour les couleurs
  getColorList: (filter) => {
    let colors = [...mockColors];
    if (filter === 'shiny_stock') {
      colors = colors.filter(c => c.shiny_stock === 1);
    } else if (filter === 'matte_stock') {
      colors = colors.filter(c => c.matte_stock === 1);
    } else if (filter === 'sanded_stock') {
      colors = colors.filter(c => c.sanded_stock === 1);
    }
    return { valid: true, value: colors };
  },

  // Pour les permissions
  getUserPermissions: (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return { valid: false, message: 'User not found', status: 404 };
    
    if (userId === 1) return { valid: true, value: mockPermissions };
    if (userId === 2) return { valid: true, value: [mockPermissions[1]] };
    if (userId === 3) return { valid: true, value: [mockPermissions[1], mockPermissions[2]] };
    
    return { valid: true, value: [] };
  }
};

module.exports = {
  mockTokens,
  mockUsers,
  mockColors,
  mockPermissions,
  mockLogs,
  authenticatedRequest,
  mockDbResponses,
  createMockToken
};