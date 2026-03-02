import { AUTH_STORAGE_KEY, SESSION_DURATION, USERS } from '../config/auth';
import { AuthState } from '../types';

export function validateCredentials(username: string, password: string): boolean {
  return USERS.some(
    user => user.username === username && user.password === password
  );
}

export function saveAuthState(username: string): void {
  try {
    const authState: AuthState = {
      isAuthenticated: true,
      user: username,
      expireAt: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Failed to save auth state to localStorage:', error);
    throw new Error('Unable to save authentication state. Please check your browser settings.');
  }
}

export function getAuthState(): AuthState | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const authState: AuthState = JSON.parse(stored);

    // Check if session expired
    if (authState.expireAt && Date.now() > authState.expireAt) {
      clearAuthState();
      return null;
    }

    return authState;
  } catch (error) {
    console.error('Failed to read auth state from localStorage:', error);
    // Clear corrupted data
    clearAuthState();
    return null;
  }
}

export function clearAuthState(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth state from localStorage:', error);
  }
}
