const CompareHash = require('../../server/utils/_CompareHash');
const Hash = require('../../server/utils/_Hash');

describe('Hash Utilities', () => {
  describe('Hash function', () => {
    test('should hash a password successfully', async () => {
      const password = 'testpassword123';
      const result = await Hash(password);
      
      expect(result.valid).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe('hashing successful');
      expect(result.value).toBeDefined();
      expect(typeof result.value).toBe('string');
      expect(result.value).not.toBe(password); // Le hash ne doit pas être identique au mot de passe
    });

    test('should handle empty password', async () => {
      const result = await Hash('');
      
      expect(result.valid).toBe(true);
      expect(result.value).toBeDefined();
    });
  });

  describe('CompareHash function', () => {
    test('should compare hash correctly when passwords match', async () => {
      const password = 'testpassword123';
      const hashResult = await Hash(password);
      const hash = hashResult.value;
      
      const compareResult = await CompareHash(password, hash);
      
      expect(compareResult.valid).toBe(true);
      expect(compareResult.status).toBe(200);
      expect(compareResult.message).toBe('hashes compared');
      expect(compareResult.value).toBe(true);
    });

    test('should compare hash correctly when passwords do not match', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword456';
      const hashResult = await Hash(password);
      const hash = hashResult.value;
      
      const compareResult = await CompareHash(wrongPassword, hash);
      
      expect(compareResult.valid).toBe(true);
      expect(compareResult.status).toBe(200);
      expect(compareResult.message).toBe('hashes compared');
      expect(compareResult.value).toBe(false);
    });

    test('should handle invalid hash format', async () => {
      const password = 'testpassword123';
      const invalidHash = 'invalid-hash';
      
      const compareResult = await CompareHash(password, invalidHash);
      
      // bcrypt.compare retourne false pour un hash invalide, donc notre fonction devrait retourner valid: true, value: false
      expect(compareResult.valid).toBe(true);
      expect(compareResult.status).toBe(200);
      expect(compareResult.message).toBe('hashes compared');
      expect(compareResult.value).toBe(false);
    });
  });
});