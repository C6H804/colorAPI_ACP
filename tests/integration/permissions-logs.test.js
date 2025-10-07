const request = require('supertest');
const express = require('express');
const { mockTokens, mockPermissions, mockLogs, mockDbResponses } = require('../helpers/testHelpers');

// Mock de la base de données
jest.mock('../../server/config/db.connection.root.js', () => ({
  execute: jest.fn()
}));

describe('Permissions and Logs Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Middleware d'authentification mock
    app.use((req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key');
          req.user = { value: decoded };
          next();
        } catch (error) {
          return res.status(401).json({ message: 'Invalid token' });
        }
      } else {
        return res.status(401).json({ message: 'No token provided' });
      }
    });

    // Mock route GET /api/permissions
    app.get('/api/permissions', (req, res) => {
      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      return res.status(200).json({
        message: 'Permissions retrieved successfully',
        valid: true,
        value: mockPermissions
      });
    });

    // Mock route GET /api/permissions/:id
    app.get('/api/permissions/:id', (req, res) => {
      const userId = parseInt(req.params.id);

      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      // Validation de l'ID
      if (!userId || userId <= 0) {
        return res.status(400).json({ message: 'id is not valid', status: 400 });
      }

      // Vérifier si l'utilisateur existe et récupérer ses permissions
      const userPermissionsData = mockDbResponses.getUserPermissions(userId);
      if (!userPermissionsData.valid) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'User permissions retrieved successfully',
        value: userPermissionsData.value
      });
    });

    // Mock route GET /api/logs
    app.get('/api/logs', (req, res) => {
      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      return res.status(200).json({
        message: 'Logs retrieved successfully',
        value: mockLogs
      });
    });
  });

  describe('GET /api/permissions', () => {
    test('should return all permissions for admin', async () => {
      const response = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Permissions retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(mockPermissions.length);
      
      // Vérifier la structure des permissions
      response.body.value.forEach(permission => {
        expect(permission).toHaveProperty('id');
        expect(permission).toHaveProperty('name');
        expect(permission).toHaveProperty('description');
      });

      // Vérifier les permissions spécifiques
      const permissionNames = response.body.value.map(p => p.name);
      expect(permissionNames).toContain('admin');
      expect(permissionNames).toContain('visitor');
      expect(permissionNames).toContain('modify_colors');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject modifier user', async () => {
      const response = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${mockTokens.modifier}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject unauthorized request', async () => {
      const response = await request(app)
        .get('/api/permissions')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${mockTokens.invalid}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('GET /api/permissions/:id', () => {
    test('should return admin user permissions', async () => {
      const response = await request(app)
        .get('/api/permissions/1')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.message).toBe('User permissions retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(3); // admin a toutes les permissions
      
      const permissionNames = response.body.value.map(p => p.name);
      expect(permissionNames).toContain('admin');
      expect(permissionNames).toContain('visitor');
      expect(permissionNames).toContain('modify_colors');
    });

    test('should return visitor user permissions', async () => {
      const response = await request(app)
        .get('/api/permissions/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.message).toBe('User permissions retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(1); // visitor a seulement visitor
      expect(response.body.value[0].name).toBe('visitor');
    });

    test('should return modifier user permissions', async () => {
      const response = await request(app)
        .get('/api/permissions/3')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.message).toBe('User permissions retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(2); // modifier a visitor + modify_colors
      
      const permissionNames = response.body.value.map(p => p.name);
      expect(permissionNames).toContain('visitor');
      expect(permissionNames).toContain('modify_colors');
      expect(permissionNames).not.toContain('admin');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/permissions/1')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject invalid user ID', async () => {
      const response = await request(app)
        .get('/api/permissions/0')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(400);

      expect(response.body.message).toBe('id is not valid');
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/permissions/999')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    test('should reject string ID', async () => {
      const response = await request(app)
        .get('/api/permissions/abc')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(400);

      expect(response.body.message).toBe('id is not valid');
    });

    test('should reject negative ID', async () => {
      const response = await request(app)
        .get('/api/permissions/-1')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(400);

      expect(response.body.message).toBe('id is not valid');
    });
  });

  describe('GET /api/logs', () => {
    test('should return all logs for admin', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.message).toBe('Logs retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(mockLogs.length);
      
      // Vérifier la structure des logs
      response.body.value.forEach(log => {
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('action');
        expect(log).toHaveProperty('user_id');
        expect(log).toHaveProperty('timestamp');
        expect(log).toHaveProperty('details');
      });

      // Vérifier les types d'actions spécifiques
      const actions = response.body.value.map(log => log.action);
      expect(actions).toContain('COLOR_ADDED');
      expect(actions).toContain('USER_LOGIN');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject modifier user', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.modifier}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject unauthorized request', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.invalid}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    test('should return logs with correct timestamp format', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      response.body.value.forEach(log => {
        // Vérifier que le timestamp est au format ISO
        expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(new Date(log.timestamp)).toBeInstanceOf(Date);
      });
    });

    test('should return logs with user_id as number', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      response.body.value.forEach(log => {
        expect(typeof log.user_id).toBe('number');
        expect(log.user_id).toBeGreaterThan(0);
      });
    });
  });
});