import { describe, it, expect } from 'vitest';
import { parseNumberToBlocks } from '../numberParser';

describe('parseNumberToBlocks', () => {
  it('should parse level1 number with only ones', () => {
    const result = parseNumberToBlocks(7, 'level1');
    expect(result).toEqual([
      { type: 'one', value: 1, count: 7 }
    ]);
  });

  it('should parse level1 number with only tens', () => {
    const result = parseNumberToBlocks(30, 'level1');
    expect(result).toEqual([
      { type: 'ten', value: 10, count: 3 }
    ]);
  });

  it('should parse level1 number with tens and ones', () => {
    const result = parseNumberToBlocks(37, 'level1');
    expect(result).toEqual([
      { type: 'ten', value: 10, count: 3 },
      { type: 'one', value: 1, count: 7 }
    ]);
  });

  it('should parse level2 number with hundreds', () => {
    const result = parseNumberToBlocks(345, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 },
      { type: 'ten', value: 10, count: 4 },
      { type: 'one', value: 1, count: 5 }
    ]);
  });

  it('should parse level2 number with only hundreds', () => {
    const result = parseNumberToBlocks(300, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 }
    ]);
  });

  it('should parse level2 number with hundreds and tens only', () => {
    const result = parseNumberToBlocks(340, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 },
      { type: 'ten', value: 10, count: 4 }
    ]);
  });
});
