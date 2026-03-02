import { Block, DifficultyLevel } from '../types';

export function parseNumberToBlocks(num: number, difficulty: DifficultyLevel): Block[] {
  const blocks: Block[] = [];

  if (difficulty === 'level1') {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    if (tens > 0) {
      blocks.push({ type: 'ten', value: 10, count: tens });
    }
    if (ones > 0) {
      blocks.push({ type: 'one', value: 1, count: ones });
    }
  } else {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    if (hundreds > 0) {
      blocks.push({ type: 'hundred', value: 100, count: hundreds });
    }
    if (tens > 0) {
      blocks.push({ type: 'ten', value: 10, count: tens });
    }
    if (ones > 0) {
      blocks.push({ type: 'one', value: 1, count: ones });
    }
  }

  return blocks;
}

export type { DifficultyLevel } from '../types';