import { AUTH_STORAGE_KEY, SESSION_DURATION, USERS } from '../config/auth';
import { AuthState } from '../types';

export function validateCredentials(username: string, password: string): boolean {
  return USERS.some(
    user => user.username === username && user.password === password
  );
}

export function saveAuthState(username: string): void {
  const authState: AuthState = {
    isAuthenticated: true,
    user: username,
    expireAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

export function getAuthState(): AuthState | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  const authState: AuthState = JSON.parse(stored);

  // Check if session expired
  if (authState.expireAt && Date.now() > authState.expireAt) {
    clearAuthState();
    return null;
  }

  return authState;
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
