/**
 * Input validation utilities for the math learning application
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a number input for the application
 * @param value The input value to validate
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 * @returns ValidationResult
 */
export function validateNumber(value: string, min: number = 0, max: number = 999): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a number'
    };
  }

  // Check if value is a valid number
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    return {
      isValid: false,
      error: 'Please enter a valid number'
    };
  }

  // Check if number is within range
  if (parsed < min) {
    return {
      isValid: false,
      error: `Please enter a number greater than or equal to ${min}`
    };
  }

  if (parsed > max) {
    return {
      isValid: false,
      error: `Please enter a number less than or equal to ${max}`
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validate username for login
 * @param username The username to validate
 * @returns ValidationResult
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Username is required'
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long'
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: 'Username must be less than 20 characters long'
    };
  }

  // Check for valid characters (letters, numbers, underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validate password for login
 * @param password The password to validate
 * @returns ValidationResult
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 4) {
    return {
      isValid: false,
      error: 'Password must be at least 4 characters long'
    };
  }

  if (password.length > 50) {
    return {
      isValid: false,
      error: 'Password must be less than 50 characters long'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validate difficulty level
 * @param difficulty The difficulty level to validate
 * @returns ValidationResult
 */
export function validateDifficulty(difficulty: string): ValidationResult {
  if (!difficulty || difficulty.trim() === '') {
    return {
      isValid: false,
      error: 'Please select a difficulty level'
    };
  }

  const trimmedDifficulty = difficulty.trim();
  if (!['level1', 'level2'].includes(trimmedDifficulty)) {
    return {
      isValid: false,
      error: 'Invalid difficulty level selected'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validate equation inputs (for addition/subtraction)
 * @param num1 First number
 * @param num2 Second number
 * @param operator The operator ('+' or '-')
 * @returns ValidationResult
 */
export function validateEquation(num1: string, num2: string, operator: '+' | '-'): ValidationResult {
  const num1Validation = validateNumber(num1);
  if (!num1Validation.isValid) {
    return num1Validation;
  }

  const num2Validation = validateNumber(num2);
  if (!num2Validation.isValid) {
    return num2Validation;
  }

  const parsedNum1 = parseInt(num1);
  const parsedNum2 = parseInt(num2);

  // For subtraction, ensure num1 >= num2
  if (operator === '-' && parsedNum1 < parsedNum2) {
    return {
      isValid: false,
      error: 'For subtraction, the first number must be larger than the second number'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validate multiple inputs in a form
 * @param validators Array of validation functions
 * @param values Array of values to validate
 * @returns Array of ValidationResult
 */
export function validateMultipleInputs(
  validators: ((value: string) => ValidationResult)[],
  values: string[]
): ValidationResult[] {
  return validators.map((validator, index) => validator(values[index]));
}

/**
 * Get first error from validation results
 * @param results Array of ValidationResult
 * @returns First error message or undefined if no errors
 */
export function getFirstError(results: ValidationResult[]): string | undefined {
  return results.find(result => !result.isValid)?.error;
}

/**
 * Check if all validations passed
 * @param results Array of ValidationResult
 * @returns true if all validations passed
 */
export function allValidationsPassed(results: ValidationResult[]): boolean {
  return results.every(result => result.isValid);
}