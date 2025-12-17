import { generateOTP, generateCryptoToken } from '../../src/utils/generateTokens.js';

describe('generateOTP', () => {
  test('should generate 6-digit OTP', () => {
    const { otp } = generateOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d+$/.test(otp)).toBe(true);
  });

  test('should generate OTP with expiry date', () => {
    const { expires } = generateOTP();
    expect(expires).toBeInstanceOf(Date);
    expect(expires.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('generateCryptoToken', () => {
  // Set environment variable for testing
  beforeAll(() => {
    process.env.HMAC_VERIFICATION_CODE_SECRET = 'test-secret-key-for-testing';
  });

  test('should generate hexadecimal token', () => {
    const { token } = generateCryptoToken();
    expect(typeof token).toBe('string');
    expect(/^[0-9a-f]+$/.test(token)).toBe(true);
  });

  test('should hash token', () => {
    const { token, hashedToken } = generateCryptoToken();
    expect(token).not.toBe(hashedToken);
    expect(hashedToken.length).toBeGreaterThan(0);
  });
});
