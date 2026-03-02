import { describe, it, expect } from 'vitest';
import {
  validateNumber,
  validateUsername,
  validatePassword,
  validateDifficulty,
  validateEquation,
  validateMultipleInputs,
  getFirstError,
  allValidationsPassed,
  ValidationResult
} from '../validator';

describe('validateNumber', () => {
  it('should accept valid numbers', () => {
    const result = validateNumber('123');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty string', () => {
    const result = validateNumber('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a number');
  });

  it('should reject non-numeric strings', () => {
    const result = validateNumber('abc');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid number');
  });

  it('should reject negative numbers', () => {
    const result = validateNumber('-5');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a number greater than or equal to 0');
  });

  it('should reject numbers above max', () => {
    const result = validateNumber('1000', 0, 999);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a number less than or equal to 999');
  });

  it('should reject numbers below min', () => {
    const result = validateNumber('-1', 0, 999);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a number greater than or equal to 0');
  });

  it('should accept numbers with whitespace', () => {
    const result = validateNumber('  123  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateUsername', () => {
  it('should accept valid usernames', () => {
    const result = validateUsername('student123');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty username', () => {
    const result = validateUsername('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Username is required');
  });

  it('should reject short usernames', () => {
    const result = validateUsername('ab');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Username must be at least 3 characters long');
  });

  it('should reject long usernames', () => {
    const result = validateUsername('a'.repeat(21));
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Username must be less than 20 characters long');
  });

  it('should reject usernames with invalid characters', () => {
    const result = validateUsername('user@name');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
  });

  it('should accept usernames with underscores', () => {
    const result = validateUsername('user_name');
    expect(result.isValid).toBe(true);
  });

  it('should accept numeric usernames', () => {
    const result = validateUsername('12345');
    expect(result.isValid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('should accept valid passwords', () => {
    const result = validatePassword('password123');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Password is required');
  });

  it('should reject short passwords', () => {
    const result = validatePassword('123');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Password must be at least 4 characters long');
  });

  it('should reject long passwords', () => {
    const result = validatePassword('a'.repeat(51));
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Password must be less than 50 characters long');
  });

  it('should accept 4-character passwords', () => {
    const result = validatePassword('1234');
    expect(result.isValid).toBe(true);
  });
});

describe('validateDifficulty', () => {
  it('should accept valid difficulty levels', () => {
    const result1 = validateDifficulty('level1');
    const result2 = validateDifficulty('level2');
    expect(result1.isValid).toBe(true);
    expect(result2.isValid).toBe(true);
  });

  it('should reject empty difficulty', () => {
    const result = validateDifficulty('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select a difficulty level');
  });

  it('should reject invalid difficulty levels', () => {
    const result = validateDifficulty('level3');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid difficulty level selected');
  });

  it('should accept whitespace-trimmed difficulty', () => {
    const result = validateDifficulty('  level1  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateEquation', () => {
  it('should accept valid addition equation', () => {
    const result = validateEquation('15', '7', '+');
    expect(result.isValid).toBe(true);
  });

  it('should accept valid subtraction equation', () => {
    const result = validateEquation('15', '7', '-');
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid addition numbers', () => {
    const result = validateEquation('abc', '7', '+');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid number');
  });

  it('should reject invalid subtraction numbers', () => {
    const result = validateEquation('15', 'xyz', '-');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid number');
  });

  it('should reject subtraction with num1 < num2', () => {
    const result = validateEquation('7', '15', '-');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('For subtraction, the first number must be larger than the second number');
  });

  it('should accept subtraction with num1 == num2', () => {
    const result = validateEquation('15', '15', '-');
    expect(result.isValid).toBe(true);
  });
});

describe('validateMultipleInputs', () => {
  it('should validate multiple inputs with validators', () => {
    const validators = [
      validateNumber,
      validateNumber
    ];
    const values = ['123', '456'];

    const results = validateMultipleInputs(validators, values);
    expect(results).toHaveLength(2);
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(true);
  });

  it('should return invalid results for invalid inputs', () => {
    const validators = [
      validateUsername,
      validatePassword
    ];
    const values = ['ab', '123'];

    const results = validateMultipleInputs(validators, values);
    expect(results[0].isValid).toBe(false);
    expect(results[1].isValid).toBe(false);
  });
});

describe('getFirstError', () => {
  it('should return first error from results', () => {
    const results: ValidationResult[] = [
      { isValid: true },
      { isValid: false, error: 'First error' },
      { isValid: false, error: 'Second error' }
    ];

    const error = getFirstError(results);
    expect(error).toBe('First error');
  });

  it('should return undefined when no errors', () => {
    const results: ValidationResult[] = [
      { isValid: true },
      { isValid: true }
    ];

    const error = getFirstError(results);
    expect(error).toBeUndefined();
  });

  it('should return undefined when results is empty', () => {
    const error = getFirstError([]);
    expect(error).toBeUndefined();
  });
});

describe('allValidationsPassed', () => {
  it('should return true when all validations passed', () => {
    const results: ValidationResult[] = [
      { isValid: true },
      { isValid: true },
      { isValid: true }
    ];

    const result = allValidationsPassed(results);
    expect(result).toBe(true);
  });

  it('should return false when some validations failed', () => {
    const results: ValidationResult[] = [
      { isValid: true },
      { isValid: false },
      { isValid: true }
    ];

    const result = allValidationsPassed(results);
    expect(result).toBe(false);
  });

  it('should return false when all validations failed', () => {
    const results: ValidationResult[] = [
      { isValid: false },
      { isValid: false }
    ];

    const result = allValidationsPassed(results);
    expect(result).toBe(false);
  });

  it('should return true for empty results', () => {
    const result = allValidationsPassed([]);
    expect(result).toBe(true);
  });
});