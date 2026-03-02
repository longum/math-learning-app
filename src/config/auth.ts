import { User } from '../types';

export const USERS: User[] = [
  { username: 'student1', password: 'math123' },
  { username: 'student2', password: 'learn456' },
];

export const AUTH_STORAGE_KEY = 'math-app-auth';
export const PREFS_STORAGE_KEY = 'math-app-preferences';
export const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
