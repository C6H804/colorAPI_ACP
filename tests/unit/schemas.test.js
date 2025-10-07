const verifyUser = require('../../server/schemas/verifyUser.schema');
const verifyFilters = require('../../server/schemas/verifyFilters.schema');
const verifyColorStock = require('../../server/schemas/verifyColorStock.schema');
const verifyNewPermissions = require('../../server/schemas/verifyNewPermissions.schema');

describe('Joi Schema Validation', () => {
  describe('verifyUser schema', () => {
    test('should validate correct user data', async () => {
      const validUserData = {
        username: 'testuser',
        password: 'testpassword123',
        description: 'Test user description'
      };

      const result = await verifyUser(validUserData);
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('validation successful');
      expect(result.value).toMatchObject({
        username: 'testuser',
        password: 'testpassword123',
        description: 'Test user description'
      });
    });

    test('should validate user without description', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword123'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(true);
      expect(result.value.description).toBe('aucune description');
    });

    test('should reject invalid username (too short)', async () => {
      const userData = {
        username: 'ab',
        password: 'testpassword123'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(422);
      expect(result.message).toContain('length must be at least 3');
    });

    test('should reject invalid username (uppercase)', async () => {
      const userData = {
        username: 'TestUser',
        password: 'testpassword123'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('pattern');
    });

    test('should reject invalid password (too short)', async () => {
      const userData = {
        username: 'testuser',
        password: 'short'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('length must be at least 10');
    });

    test('should reject invalid password (special characters)', async () => {
      const userData = {
        username: 'testuser',
        password: 'password@123!'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('pattern');
    });

    test('should reject missing username', async () => {
      const userData = {
        password: 'testpassword123'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('missing username or password');
    });

    test('should reject missing password', async () => {
      const userData = {
        username: 'testuser'
      };

      const result = await verifyUser(userData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('missing username or password');
    });

    test('should reject empty data', async () => {
      const result = await verifyUser({});
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('no data provided');
    });

    test('should reject null data', async () => {
      const result = await verifyUser(null);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('no data provided');
    });
  });

  describe('verifyFilters schema', () => {
    test('should validate correct filter values', () => {
      const validFilters = ['shiny_stock', 'matte_stock', 'sanded_stock'];
      
      validFilters.forEach(filter => {
        const result = verifyFilters(filter);
        expect(result.valid).toBe(true);
        expect(result.status).toBe(200);
        expect(result.value).toBe(filter);
      });
    });

    test('should reject invalid filter', () => {
      const result = verifyFilters('invalid_filter');
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('no filter provided');
    });

    test('should reject empty filter', () => {
      const result = verifyFilters('');
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('no filter provided');
    });

    test('should reject null filter', () => {
      const result = verifyFilters(null);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('no filter provided');
    });

    test('should reject whitespace-only filter', () => {
      const result = verifyFilters('   ');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('no filter provided');
    });
  });

  describe('verifyColorStock schema', () => {
    test('should validate correct stock data', () => {
      const validStockData = {
        shiny_stock: 1,
        matte_stock: 0,
        sanded_stock: 1
      };

      const result = verifyColorStock(validStockData);
      
      expect(result.valid).toBe(true);
      expect(result.value).toEqual(validStockData);
    });

    test('should validate partial stock data', () => {
      const partialData = {
        shiny_stock: 1
      };

      const result = verifyColorStock(partialData);
      
      expect(result.valid).toBe(true);
      expect(result.value.shiny_stock).toBe(1);
    });

    test('should validate all zeros', () => {
      const stockData = {
        shiny_stock: 0,
        matte_stock: 0,
        sanded_stock: 0
      };

      const result = verifyColorStock(stockData);
      
      expect(result.valid).toBe(true);
      expect(result.value).toEqual(stockData);
    });

    test('should reject invalid stock values (greater than 1)', () => {
      const invalidData = {
        shiny_stock: 2,
        matte_stock: 0
      };

      const result = verifyColorStock(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('must be less than or equal to 1');
    });

    test('should reject invalid stock values (negative)', () => {
      const invalidData = {
        shiny_stock: -1,
        matte_stock: 0
      };

      const result = verifyColorStock(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('must be greater than or equal to 0');
    });

    test('should reject non-integer values', () => {
      const invalidData = {
        shiny_stock: 0.5,
        matte_stock: 1
      };

      const result = verifyColorStock(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('must be an integer');
    });

    test('should coerce string numbers to integers', () => {
      const data = {
        shiny_stock: '1',
        matte_stock: 0
      };

      const result = verifyColorStock(data);
      
      expect(result.valid).toBe(true);
      expect(result.value.shiny_stock).toBe(1);
      expect(typeof result.value.shiny_stock).toBe('number');
    });
  });

  describe('verifyNewPermissions schema', () => {
    test('should validate correct permissions data', async () => {
      const validData = {
        username: 'testuser',
        description: 'Test description',
        permissions: { 1: true, 2: false, 3: true }
      };

      const result = await verifyNewPermissions(validData);
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Validation successful');
    });

    test('should validate without description', async () => {
      const validData = {
        username: 'testuser',
        permissions: { 1: true }
      };

      const result = await verifyNewPermissions(validData);
      
      expect(result.valid).toBe(true);
    });

    test('should reject invalid username (too short)', async () => {
      const invalidData = {
        username: 'ab',
        permissions: { 1: true }
      };

      const result = await verifyNewPermissions(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toContain('length must be at least 3');
    });

    test('should reject invalid username (uppercase)', async () => {
      const invalidData = {
        username: 'TestUser',
        permissions: { 1: true }
      };

      const result = await verifyNewPermissions(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('pattern');
    });

    test('should accept array permissions format', async () => {
      const validData = {
        username: 'testuser',
        permissions: [1, 2, 3]
      };

      const result = await verifyNewPermissions(validData);
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Validation successful');
    });

    test('should reject missing permissions', async () => {
      const invalidData = {
        username: 'testuser'
      };

      const result = await verifyNewPermissions(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Permissions must be an array');
    });

    test('should reject null permissions', async () => {
      const invalidData = {
        username: 'testuser',
        permissions: null
      };

      const result = await verifyNewPermissions(invalidData);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Permissions must be an array');
    });

    test('should reject no user info', async () => {
      const result = await verifyNewPermissions(null);
      
      expect(result.valid).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('No user info provided');
    });
  });
});