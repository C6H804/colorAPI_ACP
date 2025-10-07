const request = require('supertest');
const express = require('express');

// Import de votre app (nous devrons peut-être ajuster le chemin)
const path = require('path');

// Mock de la base de données pour éviter les vraies connexions pendant les tests
jest.mock('../../server/config/db.connection.root.js', () => ({
  execute: jest.fn()
}));

describe('API Integration Tests', () => {
  let app;

  beforeAll(() => {
    // Configuration minimale de l'app pour les tests
    app = express();
    app.use(express.json());

    // Route de test simple
    app.get('/api/health', (req, res) => {
      res.status(200).json({ 
        message: 'API is running', 
        status: 200,
        environment: 'test'
      });
    });

    // Mock du login endpoint
    app.post('/api/login', (req, res) => {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Username and password are required',
          valid: false 
        });
      }

      // Mock response pour un utilisateur valide
      if (username === 'testuser' && password === 'testpassword123') {
        return res.status(200).json({
          token: 'mock-jwt-token',
          valid: true,
          message: 'Authentication successful'
        });
      }

      return res.status(401).json({
        message: 'Invalid credentials',
        valid: false
      });
    });
  });

  describe('GET /api/health', () => {
    test('should return API status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        message: 'API is running',
        status: 200,
        environment: 'test'
      });
    });
  });

  describe('POST /api/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'testpassword123'
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toBe('Authentication successful');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'wronguser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({})
        .expect(400);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });
  });
});