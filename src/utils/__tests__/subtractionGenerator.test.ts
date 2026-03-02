import { describe, it, expect } from 'vitest';
import { generateSubtractionAnimation } from '../subtractionGenerator';

describe('generateSubtractionAnimation', () => {
  describe('Level 1 (Tens and Ones)', () => {
    it('should generate steps for simple subtraction without borrowing', () => {
      const steps = generateSubtractionAnimation(15, 3, 'level1');

      expect(steps).toHaveLength(4);
      expect(steps[0].description).toBe('Subtract 3 from 15');
      expect(steps[1].description).toBe('First, we show 15:');
      expect(steps[2].description).toBe('We need to remove 3 from the total:');
      expect(steps[3].description).toBe('The final answer is 12:');
      expect(steps[3].showResult).toBe(true);
    });

    it('should generate steps for subtraction with borrowing', () => {
      const steps = generateSubtractionAnimation(12, 7, 'level1');

      expect(steps.length).toBeGreaterThan(4);
      expect(steps[0].description).toBe('Subtract 7 from 12');

      // Should have borrowing step
      const borrowStep = steps.find(step =>
        step.description.includes('Borrow 1 ten and add 10 ones')
      );
      expect(borrowStep).toBeDefined();
    });

    it('should handle subtraction from tens', () => {
      const steps = generateSubtractionAnimation(20, 5, 'level1');

      expect(steps[0].description).toBe('Subtract 5 from 20');
      const resultStep = steps.find(step => step.showResult);
      expect(resultStep).toBeDefined();
      expect(resultStep?.blocks?.[0]).toEqual([
        { type: 'ten', value: 10, count: 1 }
      ]);
    });

    it('should handle zero result', () => {
      const steps = generateSubtractionAnimation(8, 8, 'level1');

      expect(steps[0].description).toBe('Subtract 8 from 8');
      const resultStep = steps.find(step => step.showResult);
      expect(resultStep).toBeDefined();
      expect(resultStep?.blocks).toEqual([]);
    });
  });

  describe('Level 2 (Hundreds, Tens, Ones)', () => {
    it('should generate steps for simple subtraction without borrowing', () => {
      const steps = generateSubtractionAnimation(156, 45, 'level2');

      expect(steps[0].description).toBe('Subtract 45 from 156');
      const resultStep = steps.find(step => step.showResult);
      expect(resultStep).toBeDefined();
      expect(resultStep?.blocks?.[0]).toEqual([
        { type: 'hundred', value: 100, count: 1 },
        { type: 'ten', value: 10, count: 1 },
        { type: 'one', value: 1, count: 1 }
      ]);
    });

    it('should generate steps for ones borrowing', () => {
      const steps = generateSubtractionAnimation(132, 45, 'level2');

      const borrowStep = steps.find(step =>
        step.description.includes('Borrow 1 ten and add 10 ones')
      );
      expect(borrowStep).toBeDefined();
    });

    it('should generate steps for tens borrowing', () => {
      const steps = generateSubtractionAnimation(105, 15, 'level2');

      const borrowStep = steps.find(step =>
        step.description.includes('Borrow 1 hundred and add 10 tens')
      );
      expect(borrowStep).toBeDefined();
    });

    it('should generate steps for double borrowing', () => {
      const steps = generateSubtractionAnimation(102, 25, 'level2');

      // Should have multiple borrowing steps
      const borrowSteps = steps.filter(step => step.borrowed);
      expect(borrowSteps.length).toBeGreaterThan(1);

      // Should borrow from hundreds to tens, then from tens to ones
      expect(borrowSteps[0].description).toContain('Borrow 1 hundred and add 10 tens');
      expect(borrowSteps[1].description).toContain('Borrow 1 ten and add 10 ones');
    });

    it('should handle borrowing when no tens are available', () => {
      const steps = generateSubtractionAnimation(201, 12, 'level2');

      const borrowStep = steps.find(step =>
        step.description.includes('Borrow 1 hundred and add 10 tens')
      );
      expect(borrowStep).toBeDefined();
    });
  });

  it('should handle case where subtrahend is larger than minuend', () => {
    const steps = generateSubtractionAnimation(5, 8, 'level1');

    expect(steps).toHaveLength(1);
    expect(steps[0].description).toBe('8 is larger than 5. We cannot subtract 8 from 5.');
    expect(steps[0].action).toBe('error');
  });

  it('should handle subtraction from zero', () => {
    const steps = generateSubtractionAnimation(0, 0, 'level1');

    expect(steps[0].description).toBe('Subtract 0 from 0');
    const resultStep = steps.find(step => step.showResult);
    expect(resultStep).toBeDefined();
    expect(resultStep?.blocks).toEqual([]);
  });

  it('should handle maximum values', () => {
    const steps = generateSubtractionAnimation(999, 0, 'level2');

    expect(steps[0].description).toBe('Subtract 0 from 999');
    const resultStep = steps.find(step => step.showResult);
    expect(resultStep).toBeDefined();
    expect(resultStep?.blocks?.[0]).toEqual([
      { type: 'hundred', value: 100, count: 9 },
      { type: 'ten', value: 10, count: 9 },
      { type: 'one', value: 1, count: 9 }
    ]);
  });
});