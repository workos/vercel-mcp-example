import { ensureUserAuthenticated, isAuthenticated } from '../lib/auth/helpers';
import { User } from '../lib/auth/types';

describe('Authentication Helpers', () => {
  const mockUser: User = {
    id: 'user_123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockAuthInfo = {
    extra: {
      user: mockUser,
      claims: { sub: 'user_123' },
    },
  };

  describe('isAuthenticated', () => {
    it('should return true for valid auth info', () => {
      expect(isAuthenticated(mockAuthInfo)).toBe(true);
    });

    it('should return false for null auth info', () => {
      expect(isAuthenticated(null)).toBe(false);
    });

    it('should return false for auth info without user', () => {
      expect(isAuthenticated({ extra: {} })).toBe(false);
    });
  });

  describe('ensureUserAuthenticated', () => {
    it('should return user for valid auth info', () => {
      expect(ensureUserAuthenticated(mockAuthInfo)).toEqual(mockUser);
    });

    it('should throw error for null auth info', () => {
      expect(() => ensureUserAuthenticated(null)).toThrow(
        'Authentication required for this tool'
      );
    });

    it('should throw error for auth info without user', () => {
      expect(() => ensureUserAuthenticated({ extra: {} })).toThrow(
        'Authentication required for this tool'
      );
    });
  });
}); 