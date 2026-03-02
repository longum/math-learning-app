import { describe, it, expect } from 'vitest';
import { generateAdditionAnimation } from '../additionGenerator';

describe('generateAdditionAnimation', () => {
  describe('Level 1 (Tens and Ones)', () => {
    it('should generate steps for simple addition without regrouping', () => {
      const steps = generateAdditionAnimation(12, 7, 'level1');

      expect(steps).toHaveLength(4);
      expect(steps[0].description).toBe('Add 12 + 7');
      expect(steps[1].description).toBe('First, we show 12:');
      expect(steps[2].description).toBe('Now, add 7 by bringing in these blocks:');
      expect(steps[3].description).toBe('Count all blocks together to get 19:');
      expect(steps[3].showResult).toBe(true);
    });

    it('should generate steps for addition with regrouping', () => {
      const steps = generateAdditionAnimation(8, 7, 'level1');

      expect(steps.length).toBeGreaterThan(4);
      expect(steps[0].description).toBe('Add 8 + 7');

      // Should have regrouping step
      const regroupStep = steps.find(step =>
        step.description.includes('Regroup 10 ones into 1 ten')
      );
      expect(regroupStep).toBeDefined();
    });

    it('should handle addition to make hundreds', () => {
      const steps = generateAdditionAnimation(95, 5, 'level1');

      const resultStep = steps.find(step => step.showResult);
      expect(resultStep).toBeDefined();
      expect(resultStep?.blocks?.[0]).toEqual([
        { type: 'ten', value: 10, count: 10 }
      ]);
    });
  });

  describe('Level 2 (Hundreds, Tens, Ones)', () => {
    it('should generate steps for addition without regrouping', () => {
      const steps = generateAdditionAnimation(123, 45, 'level2');

      expect(steps[0].description).toBe('Add 123 + 45');
      expect(steps[3].description).toBe('Count all blocks together to get 168:');
      expect(steps[3].showResult).toBe(true);
    });

    it('should generate steps for ones regrouping', () => {
      const steps = generateAdditionAnimation(137, 26, 'level2');

      const regroupStep = steps.find(step =>
        step.description.includes('Regroup 10 ones into 1 ten')
      );
      expect(regroupStep).toBeDefined();
    });

    it('should generate steps for tens regrouping', () => {
      const steps = generateAdditionAnimation(85, 25, 'level2');

      const regroupStep = steps.find(step =>
        step.description.includes('Regroup 10 tens into 1 hundred')
      );
      expect(regroupStep).toBeDefined();
    });

    it('should handle multiple regrouping steps', () => {
      const steps = generateAdditionAnimation(99, 99, 'level2');

      expect(steps.length).toBeGreaterThan(6);

      const onesRegroupStep = steps.find(step =>
        step.description.includes('Regroup 10 ones into 1 ten')
      );
      const tensRegroupStep = steps.find(step =>
        step.description.includes('Regroup 10 tens into 1 hundred')
      );

      expect(onesRegroupStep).toBeDefined();
      expect(tensRegroupStep).toBeDefined();
    });
  });

  it('should generate steps for zero values', () => {
    const steps = generateAdditionAnimation(0, 5, 'level1');

    expect(steps[0].description).toBe('Add 0 + 5');
    expect(steps[1].description).toBe('First, we show 0:');
    expect(steps[3].description).toBe('Count all blocks together to get 5:');
    expect(steps[3].showResult).toBe(true);
  });

  it('should generate steps for maximum values', () => {
    const steps = generateAdditionAnimation(999, 0, 'level2');

    expect(steps[0].description).toBe('Add 999 + 0');
    const resultStep = steps.find(step => step.showResult);
    expect(resultStep).toBeDefined();
    expect(resultStep?.blocks?.[0]).toEqual([
      { type: 'hundred', value: 100, count: 9 },
      { type: 'ten', value: 10, count: 9 },
      { type: 'one', value: 1, count: 9 }
    ]);
  });
});