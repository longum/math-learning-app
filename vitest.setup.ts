/// <reference types="vitest/globals" />

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
});