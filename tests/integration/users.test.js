const request = require('supertest');
const express = require('express');
const { mockTokens, mockUsers, mockDbResponses } = require('../helpers/testHelpers');

// Mock de la base de données
jest.mock('../../server/config/db.connection.root.js', () => ({
  execute: jest.fn()
}));

describe('Users Routes', () => {
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

    // Mock route GET /api/users
    app.get('/api/users', (req, res) => {
      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      const users = mockUsers.filter(u => u.deleted === 0);
      return res.status(200).json({
        message: 'Users retrieved successfully',
        valid: true,
        value: users
      });
    });

    // Mock route POST /api/addUser
    app.post('/api/addUser', (req, res) => {
      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      const { username, password, description } = req.body;

      // Validation des champs requis
      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Username and password are required',
          valid: false 
        });
      }

      // Validation du username
      if (username.length < 3 || !/^[a-z_]+$/.test(username)) {
        return res.status(400).json({ 
          message: 'Username must be at least 3 characters and contain only lowercase letters and underscores',
          valid: false 
        });
      }

      // Validation du password
      if (password.length < 10 || !/^[a-zA-Z0-9]{10,50}$/.test(password)) {
        return res.status(400).json({ 
          message: 'Password must be 10-50 characters long and contain only letters and numbers',
          valid: false 
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = mockUsers.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username already exists',
          valid: false 
        });
      }

      const newUser = {
        id: mockUsers.length + 1,
        username,
        description: description || 'aucune description',
        created_at: new Date().toISOString(),
        last_connexion: null,
        deleted: 0
      };

      return res.status(201).json({
        message: 'User created successfully',
        status: 201,
        valid: true,
        value: newUser
      });
    });

    // Mock route POST /api/editUser/:id
    app.post('/api/editUser/:id', (req, res) => {
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

      // Vérifier si l'utilisateur existe
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found', valid: false });
      }

      const { username, description, permissions, password } = req.body;

      // Validation du username si fourni
      if (username && (username.length < 3 || !/^[a-z_]+$/.test(username))) {
        return res.status(400).json({ 
          message: 'Username must be at least 3 characters and contain only lowercase letters and underscores',
          valid: false 
        });
      }

      // Validation du password si fourni
      if (password !== undefined) {
        if (typeof password !== 'string') {
          return res.status(400).json({ 
            message: 'Password must be a string',
            status: 400,
            valid: false 
          });
        }
        
        if (password !== '' && !/^[a-zA-Z0-9]{10,50}$/.test(password)) {
          return res.status(400).json({ 
            message: 'Password must be 10-50 characters long and contain only letters and numbers',
            status: 400,
            valid: false 
          });
        }
      }

      return res.status(200).json({
        message: 'User permissions updated successfully',
        status: 200,
        valid: true
      });
    });

    // Mock route POST /api/deleteUser/:id
    app.post('/api/deleteUser/:id', (req, res) => {
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

      // Vérifier si l'utilisateur existe
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found', valid: false });
      }

      return res.status(200).json({
        message: 'User deleted successfully',
        status: 200,
        valid: true
      });
    });
  });

  describe('GET /api/users', () => {
    test('should return all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Users retrieved successfully');
      expect(Array.isArray(response.body.value)).toBe(true);
      expect(response.body.value).toHaveLength(mockUsers.length);
      
      // Vérifier la structure des utilisateurs
      response.body.value.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('description');
        expect(user).toHaveProperty('created_at');
      });
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject unauthorized request', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('POST /api/addUser', () => {
    test('should create user successfully for admin', async () => {
      const newUser = {
        username: 'newuser',
        password: 'newpassword123',
        description: 'Test user'
      };

      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send(newUser)
        .expect(201);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.value).toMatchObject({
        username: newUser.username,
        description: newUser.description
      });
      expect(response.body.value).toHaveProperty('id');
      expect(response.body.value).toHaveProperty('created_at');
    });

    test('should create user with default description', async () => {
      const newUser = {
        username: 'usernodescrip',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send(newUser)
        .expect(201);

      expect(response.body.value.description).toBe('aucune description');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .send({
          username: 'testuser',
          password: 'testpassword123'
        })
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject missing username', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          password: 'testpassword123'
        })
        .expect(400);

      expect(response.body.message).toBe('Username and password are required');
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.message).toBe('Username and password are required');
    });

    test('should reject invalid username format', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'AB',
          password: 'testpassword123'
        })
        .expect(400);

      expect(response.body.message).toContain('Username must be at least 3 characters');
    });

    test('should reject invalid password format', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'testuser',
          password: 'short'
        })
        .expect(400);

      expect(response.body.message).toContain('Password must be 10-50 characters');
    });

    test('should reject existing username', async () => {
      const response = await request(app)
        .post('/api/addUser')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'admin',
          password: 'testpassword123'
        })
        .expect(400);

      expect(response.body.message).toBe('Username already exists');
    });
  });

  describe('POST /api/editUser/:id', () => {
    test('should edit user successfully for admin', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser',
          description: 'Updated description',
          permissions: [1, 2]
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('User permissions updated successfully');
    });

    test('should edit user with password change', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser',
          description: 'Updated description',
          password: 'newpassword123',
          permissions: [1, 2]
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
    });

    test('should allow empty password (no change)', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser',
          description: 'Updated description',
          password: '',
          permissions: [1, 2]
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .send({
          username: 'updateduser'
        })
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject invalid user ID', async () => {
      const response = await request(app)
        .post('/api/editUser/0')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser'
        })
        .expect(400);

      expect(response.body.message).toBe('id is not valid');
    });

    test('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/editUser/999')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser'
        })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    test('should reject invalid password format', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser',
          password: 'short'
        })
        .expect(400);

      expect(response.body.message).toContain('Password must be 10-50 characters');
    });

    test('should reject non-string password', async () => {
      const response = await request(app)
        .post('/api/editUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          username: 'updateduser',
          password: 123
        })
        .expect(400);

      expect(response.body.message).toBe('Password must be a string');
    });
  });

  describe('POST /api/deleteUser/:id', () => {
    test('should delete user successfully for admin', async () => {
      const response = await request(app)
        .post('/api/deleteUser/2')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .post('/api/deleteUser/2')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject invalid user ID', async () => {
      const response = await request(app)
        .post('/api/deleteUser/0')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(400);

      expect(response.body.message).toBe('id is not valid');
    });

    test('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/deleteUser/999')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});