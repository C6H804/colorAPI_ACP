const CreateToken = require('../../server/utils/_CreateToken');
const ReadToken = require('../../server/utils/_ReadToken');

describe('JWT Token Utilities', () => {
  const testPayload = {
    id: 1,
    username: 'testuser',
    permissions: ['visitor']
  };

  beforeAll(() => {
    // S'assurer que les variables d'environnement sont définies
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  });

  describe('CreateToken function', () => {
    test('should create a valid JWT token', async () => {
      const result = await CreateToken(testPayload);
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('token created successfully');
      expect(result.value).toBeDefined();
      expect(typeof result.value).toBe('string');
      expect(result.value.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should create token with empty payload', async () => {
      const result = await CreateToken({});
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.value).toBeDefined();
    });

    test('should create token with complex payload', async () => {
      const complexPayload = {
        id: 123,
        username: 'complex_user',
        permissions: ['admin', 'visitor', 'modify_colors'],
        metadata: {
          lastLogin: '2024-10-07T10:00:00Z',
          ip: '192.168.1.1'
        }
      };

      const result = await CreateToken(complexPayload);
      
      expect(result.valid).toBe(true);
      expect(result.value).toBeDefined();
    });
  });

  describe('ReadToken function', () => {
    test('should decode a valid token', async () => {
      // Créer un token d'abord
      const createResult = await CreateToken(testPayload);
      const token = createResult.value;
      
      const readResult = ReadToken(token);
      
      expect(readResult.valid).toBe(true);
      expect(readResult.status).toBe(200);
      expect(readResult.message).toBe('token decoded');
      expect(readResult.value).toBeDefined();
      expect(readResult.value.id).toBe(testPayload.id);
      expect(readResult.value.username).toBe(testPayload.username);
      expect(readResult.value.permissions).toEqual(testPayload.permissions);
    });

    test('should reject invalid token format', () => {
      const result = ReadToken('invalid-token');
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
      expect(result.error).toBeDefined();
    });

    test('should reject empty token', () => {
      const result = ReadToken('');
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
    });

    test('should reject null token', () => {
      const result = ReadToken(null);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
    });

    test('should reject undefined token', () => {
      const result = ReadToken(undefined);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
    });

    test('should handle expired token', async () => {
      // Créer un token avec une expiration très courte
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        testPayload, 
        process.env.JWT_SECRET, 
        { expiresIn: '-1s' } // Déjà expiré
      );
      
      const result = ReadToken(expiredToken);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
      expect(result.error).toContain('expired');
    });

    test('should handle token with wrong secret', () => {
      const jwt = require('jsonwebtoken');
      const tokenWithWrongSecret = jwt.sign(testPayload, 'wrong-secret');
      
      const result = ReadToken(tokenWithWrongSecret);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('invalid token');
    });
  });

  describe('Token roundtrip (Create + Read)', () => {
    test('should create and read token successfully', async () => {
      const originalPayload = {
        id: 42,
        username: 'roundtrip_user',
        permissions: ['admin'],
        extra: 'data'
      };

      // Créer le token
      const createResult = await CreateToken(originalPayload);
      expect(createResult.valid).toBe(true);
      
      // Lire le token
      const readResult = ReadToken(createResult.value);
      expect(readResult.valid).toBe(true);
      
      // Vérifier que les données sont préservées
      expect(readResult.value.id).toBe(originalPayload.id);
      expect(readResult.value.username).toBe(originalPayload.username);
      expect(readResult.value.permissions).toEqual(originalPayload.permissions);
      expect(readResult.value.extra).toBe(originalPayload.extra);
      
      // Vérifier que le token a des propriétés JWT standard
      expect(readResult.value).toHaveProperty('iat'); // issued at
      expect(readResult.value).toHaveProperty('exp'); // expires
    });

    test('should preserve array and object data types', async () => {
      const complexPayload = {
        id: 1,
        permissions: ['admin', 'visitor'],
        metadata: {
          lastLogin: '2024-10-07',
          settings: {
            theme: 'dark',
            notifications: true
          }
        },
        tags: ['important', 'active']
      };

      const createResult = await CreateToken(complexPayload);
      const readResult = ReadToken(createResult.value);
      
      expect(readResult.valid).toBe(true);
      expect(Array.isArray(readResult.value.permissions)).toBe(true);
      expect(Array.isArray(readResult.value.tags)).toBe(true);
      expect(typeof readResult.value.metadata).toBe('object');
      expect(readResult.value.metadata.settings.theme).toBe('dark');
    });
  });
});