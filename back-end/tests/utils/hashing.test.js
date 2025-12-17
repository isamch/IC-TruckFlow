import { hmacHash } from '../../src/utils/hashing.js';

describe('hmacHash', () => {
  // Set environment variable for testing
  beforeAll(() => {
    process.env.HMAC_VERIFICATION_CODE_SECRET = 'test-secret-key-for-testing';
  });

  test('should hash a string', () => {
    const value = 'test-value';
    const hashed = hmacHash(value);

    expect(typeof hashed).toBe('string');
    expect(hashed.length).toBeGreaterThan(0);
  });

  test('should return same hash for same input', () => {
    const value = 'test-value';
    const hash1 = hmacHash(value);
    const hash2 = hmacHash(value);

    expect(hash1).toBe(hash2);
  });

  test('should return different hash for different inputs', () => {
    const hash1 = hmacHash('value1');
    const hash2 = hmacHash('value2');

    expect(hash1).not.toBe(hash2);
  });
});
