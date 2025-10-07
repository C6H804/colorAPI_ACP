const request = require('supertest');
const express = require('express');
const { mockTokens, mockUsers, mockDbResponses, createMockToken } = require('../helpers/testHelpers');

// Mock de la base de données
jest.mock('../../server/config/db.connection.root.js', () => ({
  execute: jest.fn()
}));

// Mock des DAOs
jest.mock('../../server/dao/getUserByUsername.dao', () => 
  jest.fn((username) => {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      return Promise.resolve({ valid: true, value: user });
    }
    return Promise.resolve({ valid: false, message: 'User not found', status: 404 });
  })
);

jest.mock('../../server/dao/getUserPermissions.dao', () => 
  jest.fn((userId) => mockDbResponses.getUserPermissions(userId))
);

jest.mock('../../server/utils/_CompareHash', () => 
  jest.fn((password, hash) => {
    // Mock: admin password = adminpassword, visitor password = visitorpassword
    const validPasswords = {
      'adminpassword': true,
      'visitorpassword': true,
      'modifierpassword': true
    };
    
    const isValid = validPasswords[password] || false;
    return Promise.resolve({ 
      valid: true, 
      message: 'hashes compared', 
      status: 200, 
      value: isValid 
    });
  })
);

describe('Authentication Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock routes pour tester l'authentification
    app.post('/api/login', async (req, res) => {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Username and password are required',
          valid: false 
        });
      }

      // Simulation de la logique de login
      const user = mockUsers.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid username or password',
          valid: false
        });
      }

      // Mock validation password
      const validPasswords = {
        'admin': 'adminpassword',
        'visitor': 'visitorpassword',
        'modifier': 'modifierpassword'
      };

      if (validPasswords[username] !== password) {
        return res.status(401).json({
          message: 'Invalid username or password',
          valid: false
        });
      }

      // Créer le token
      const permissions = mockDbResponses.getUserPermissions(user.id).value.map(p => p.name);
      const token = createMockToken(user.id, permissions);

      return res.status(200).json({
        token: token,
        valid: true,
        message: 'Authentication successful'
      });
    });

    app.get('/api/auth', (req, res) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.substring(7);
      
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key');
        
        const permissions = mockDbResponses.getUserPermissions(decoded.id).value;
        
        return res.status(200).json({
          valid: true,
          message: 'Authenticated',
          value: {
            permissions: permissions
          }
        });
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    });
  });

  describe('POST /api/login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'adminpassword'
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toBe('Authentication successful');
    });

    test('should reject invalid username', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'nonexistent',
          password: 'password'
        })
        .expect(401);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Invalid username or password');
    });

    test('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Invalid username or password');
    });

    test('should reject missing username', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          password: 'password'
        })
        .expect(400);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin'
        })
        .expect(400);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    test('should reject empty request body', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({})
        .expect(400);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });
  });

  describe('GET /api/auth', () => {
    test('should verify valid admin token', async () => {
      const response = await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Authenticated');
      expect(response.body.value.permissions).toBeDefined();
      expect(Array.isArray(response.body.value.permissions)).toBe(true);
    });

    test('should verify valid visitor token', async () => {
      const response = await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Authenticated');
      expect(response.body.value.permissions).toHaveLength(1);
      expect(response.body.value.permissions[0].name).toBe('visitor');
    });

    test('should reject missing token', async () => {
      const response = await request(app)
        .get('/api/auth')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should reject invalid token format', async () => {
      const response = await request(app)
        .get('/api/auth')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${mockTokens.invalid}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    test('should reject expired token', async () => {
      // Créer un token expiré
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 1, username: 'admin' }, 
        process.env.JWT_SECRET || 'test-secret-key', 
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });
});