const request = require('supertest');
const express = require('express');
const { mockTokens, mockColors, mockDbResponses, authenticatedRequest } = require('../helpers/testHelpers');

// Mock de la base de données
jest.mock('../../server/config/db.connection.root.js', () => ({
  execute: jest.fn()
}));

describe('Colors Routes', () => {
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

    // Mock route POST /api/colors/list
    app.post('/api/colors/list', (req, res) => {
      // Vérifier les permissions
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      const requiredPermissions = ['admin', 'visitor', 'modify_colors'];
      const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));
      
      if (!hasPermission) {
        return res.status(403).json({ message: 'user lacks required permissions' });
      }

      const filter = req.body.filter;
      const colors = mockDbResponses.getColorList(filter);
      
      return res.status(200).json(colors.value);
    });

    // Mock route POST /api/colors/modifyStock/:id
    app.post('/api/colors/modifyStock/:id', (req, res) => {
      const colorId = parseInt(req.params.id);
      const { shiny_stock, matte_stock, sanded_stock } = req.body;

      // Vérifier les permissions
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      const hasPermission = userPermissions.includes('admin') || userPermissions.includes('modify_colors');
      
      if (!hasPermission) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      // Validation des données
      if (!colorId || colorId <= 0) {
        return res.status(400).json({ message: 'id must be a positive integer', valid: false });
      }

      if (![0, 1].includes(shiny_stock) || ![0, 1].includes(matte_stock) || ![0, 1].includes(sanded_stock)) {
        return res.status(400).json({ message: 'Stock values must be 0 or 1', valid: false });
      }

      // Vérifier si la couleur existe
      const color = mockColors.find(c => c.id === colorId);
      if (!color) {
        return res.status(404).json({ message: 'Color not found', valid: false });
      }

      return res.status(200).json({
        message: 'Color stock updated successfully',
        status: 200,
        valid: true
      });
    });

    // Mock route POST /api/colors/addColor
    app.post('/api/colors/addColor', (req, res) => {
      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      const { nameFr, nameEn, namePt, type, value, color, shiny_stock, matte_stock, sanded_stock } = req.body;

      // Validation des champs requis
      const requiredFields = { nameFr, nameEn, namePt, type, value, color, shiny_stock, matte_stock, sanded_stock };
      const missingFields = Object.entries(requiredFields).filter(([key, val]) => val === undefined);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.map(([key]) => key).join(', ')}`,
          valid: false 
        });
      }

      // Validation des stocks
      if (![0, 1].includes(shiny_stock) || ![0, 1].includes(matte_stock) || ![0, 1].includes(sanded_stock)) {
        return res.status(400).json({ message: 'Stock values must be 0 or 1', valid: false });
      }

      return res.status(201).json({
        message: 'Color added successfully',
        status: 201,
        valid: true,
        value: { id: mockColors.length + 1, ...req.body }
      });
    });

    // Mock route POST /api/colors/deleteColor/:id
    app.post('/api/colors/deleteColor/:id', (req, res) => {
      const colorId = parseInt(req.params.id);

      // Vérifier les permissions admin
      const userPermissions = mockDbResponses.getUserPermissions(req.user.value.id).value.map(p => p.name);
      
      if (!userPermissions.includes('admin')) {
        return res.status(403).json({ message: 'Permissions insuffisantes' });
      }

      // Validation de l'ID
      if (!colorId || colorId <= 0) {
        return res.status(400).json({ message: 'id must be a positive integer', valid: false });
      }

      // Vérifier si la couleur existe
      const color = mockColors.find(c => c.id === colorId);
      if (!color) {
        return res.status(404).json({ message: 'Color not found', valid: false });
      }

      return res.status(200).json({
        message: 'Color deleted successfully',
        valid: true
      });
    });
  });

  describe('POST /api/colors/list', () => {
    test('should return all colors for admin user', async () => {
      const response = await request(app)
        .post('/api/colors/list')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({})
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(mockColors.length);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name_fr');
      expect(response.body[0]).toHaveProperty('shiny_stock');
    });

    test('should filter colors by shiny_stock', async () => {
      const response = await request(app)
        .post('/api/colors/list')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({ filter: 'shiny_stock' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(color => {
        expect(color.shiny_stock).toBe(1);
      });
    });

    test('should work for visitor user', async () => {
      const response = await request(app)
        .post('/api/colors/list')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .send({})
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should reject unauthorized request', async () => {
      const response = await request(app)
        .post('/api/colors/list')
        .send({})
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/colors/list')
        .set('Authorization', `Bearer ${mockTokens.invalid}`)
        .send({})
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('POST /api/colors/modifyStock/:id', () => {
    test('should modify color stock successfully for admin', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/1')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          shiny_stock: 1,
          matte_stock: 0,
          sanded_stock: 1
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Color stock updated successfully');
    });

    test('should work for modify_colors permission', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/1')
        .set('Authorization', `Bearer ${mockTokens.modifier}`)
        .send({
          shiny_stock: 0,
          matte_stock: 1,
          sanded_stock: 0
        })
        .expect(200);

      expect(response.body.valid).toBe(true);
    });

    test('should reject visitor user', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/1')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .send({
          shiny_stock: 1,
          matte_stock: 0,
          sanded_stock: 1
        })
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject invalid color ID', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/0')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          shiny_stock: 1,
          matte_stock: 0,
          sanded_stock: 1
        })
        .expect(400);

      expect(response.body.message).toBe('id must be a positive integer');
    });

    test('should reject invalid stock values', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/1')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          shiny_stock: 2,
          matte_stock: 0,
          sanded_stock: 1
        })
        .expect(400);

      expect(response.body.message).toBe('Stock values must be 0 or 1');
    });

    test('should return 404 for non-existent color', async () => {
      const response = await request(app)
        .post('/api/colors/modifyStock/999')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          shiny_stock: 1,
          matte_stock: 0,
          sanded_stock: 1
        })
        .expect(404);

      expect(response.body.message).toBe('Color not found');
    });
  });

  describe('POST /api/colors/addColor', () => {
    test('should add color successfully for admin', async () => {
      const newColor = {
        nameFr: 'Vert Émeraude',
        nameEn: 'Emerald Green',
        namePt: 'Verde Esmeralda',
        type: 'RAL',
        value: 'RAL6001',
        color: '#00FF00',
        shiny_stock: 1,
        matte_stock: 1,
        sanded_stock: 0
      };

      const response = await request(app)
        .post('/api/colors/addColor')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send(newColor)
        .expect(201);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Color added successfully');
      expect(response.body.value).toMatchObject(newColor);
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .post('/api/colors/addColor')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .send({
          nameFr: 'Test',
          nameEn: 'Test',
          namePt: 'Test',
          type: 'RAL',
          value: 'RAL0000',
          color: '#000000',
          shiny_stock: 1,
          matte_stock: 0,
          sanded_stock: 0
        })
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/colors/addColor')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .send({
          nameFr: 'Test Color'
          // Champs manquants
        })
        .expect(400);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });
  });

  describe('POST /api/colors/deleteColor/:id', () => {
    test('should delete color successfully for admin', async () => {
      const response = await request(app)
        .post('/api/colors/deleteColor/1')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.message).toBe('Color deleted successfully');
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .post('/api/colors/deleteColor/1')
        .set('Authorization', `Bearer ${mockTokens.visitor}`)
        .expect(403);

      expect(response.body.message).toBe('Permissions insuffisantes');
    });

    test('should reject invalid color ID', async () => {
      const response = await request(app)
        .post('/api/colors/deleteColor/0')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(400);

      expect(response.body.message).toBe('id must be a positive integer');
    });

    test('should return 404 for non-existent color', async () => {
      const response = await request(app)
        .post('/api/colors/deleteColor/999')
        .set('Authorization', `Bearer ${mockTokens.admin}`)
        .expect(404);

      expect(response.body.message).toBe('Color not found');
    });
  });
});