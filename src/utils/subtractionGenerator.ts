import { Block, DifficultyLevel, AnimationStep } from '../types';
import { parseNumberToBlocks } from './numberParser';

interface SubtractionStep extends AnimationStep {
  borrowed?: boolean;
  highlightedBlocks?: number[];
}

export function generateSubtractionAnimation(
  num1: number,
  num2: number,
  difficulty: DifficultyLevel
): SubtractionStep[] {
  const steps: SubtractionStep[] = [];

  // Validate input
  if (num2 > num1) {
    steps.push({
      id: 0,
      description: `${num2} is larger than ${num1}. We cannot subtract ${num2} from ${num1}.`,
      blocks: [],
      action: 'error',
      showResult: false,
    });
    return steps;
  }

  const blocks1 = parseNumberToBlocks(num1, difficulty);
  const blocks2 = parseNumberToBlocks(num2, difficulty);

  // Step 0: Show the problem
  steps.push({
    id: 0,
    description: `Subtract ${num2} from ${num1}`,
    blocks: [blocks1, blocks2],
    action: 'show',
    showResult: false,
  });

  // Step 1: Show the total number
  steps.push({
    id: 1,
    description: `First, we show ${num1}:`,
    blocks: [blocks1],
    action: 'display',
    showResult: false,
  });

  // Step 2: Show what we need to remove
  steps.push({
    id: 2,
    description: `We need to remove ${num2} from the total:`,
    blocks: [blocks1],
    action: 'remove',
    showResult: false,
  });

  // Check if we need to borrow
  const needToBorrow = shouldBorrow(blocks1, blocks2, difficulty);

  if (needToBorrow) {
    // Step 3: Identify borrowing need
    steps.push({
      id: 3,
      description: `We need to regroup blocks to subtract:`,
      blocks: [blocks1],
      action: 'regroup',
      showResult: false,
    });

    let currentBlocks = [...blocks1];
    let borrowStep = 4;

    // Borrow from hundreds (for level 2)
    if (difficulty === 'level2') {
      const hundredsCount = currentBlocks.filter(b => b.type === 'hundred')[0]?.count || 0;
      const tensCount = currentBlocks.filter(b => b.type === 'ten')[0]?.count || 0;
      const onesCount = currentBlocks.filter(b => b.type === 'one')[0]?.count || 0;

      if (onesCount === 0) {
        // Need to borrow from tens
        if (tensCount > 0) {
          // Borrow from tens to ones
          currentBlocks = currentBlocks.map(b => {
            if (b.type === 'ten') {
              return { ...b, count: b.count - 1 };
            } else if (b.type === 'one') {
              return { ...b, count: b.count + 10 };
            }
            return b;
          }).filter(b => b.count > 0);

          steps.push({
            id: borrowStep++,
            description: `Borrow 1 ten and add 10 ones.`,
            blocks: [currentBlocks],
            action: 'borrow',
            showResult: false,
            borrowed: true,
          });
        } else if (hundredsCount > 0) {
          // Need to borrow from hundreds through tens
          currentBlocks = currentBlocks.map(b => {
            if (b.type === 'hundred') {
              return { ...b, count: b.count - 1 };
            } else if (b.type === 'ten') {
              return { ...b, count: b.count + 10 };
            }
            return b;
          }).filter(b => b.count > 0);

          steps.push({
            id: borrowStep++,
            description: `Borrow 1 hundred and add 10 tens.`,
            blocks: [currentBlocks],
            action: 'borrow',
            showResult: false,
            borrowed: true,
          });

          // Now borrow from tens to ones
          currentBlocks = currentBlocks.map(b => {
            if (b.type === 'ten') {
              return { ...b, count: b.count - 1 };
            } else if (b.type === 'one') {
              return { ...b, count: b.count + 10 };
            }
            return b;
          }).filter(b => b.count > 0);

          steps.push({
            id: borrowStep++,
            description: `Borrow 1 ten and add 10 ones.`,
            blocks: [currentBlocks],
            action: 'borrow',
            showResult: false,
            borrowed: true,
          });
        }
      }
    } else {
      // Level 1: Only need to borrow between tens and ones
      const tensCount = currentBlocks.filter(b => b.type === 'ten')[0]?.count || 0;
      const onesCount = currentBlocks.filter(b => b.type === 'one')[0]?.count || 0;

      if (onesCount === 0 && tensCount > 0) {
        currentBlocks = currentBlocks.map(b => {
          if (b.type === 'ten') {
            return { ...b, count: b.count - 1 };
          } else if (b.type === 'one') {
            return { ...b, count: b.count + 10 };
          }
          return b;
        }).filter(b => b.count > 0);

        steps.push({
          id: borrowStep++,
          description: `Borrow 1 ten and add 10 ones.`,
          blocks: [currentBlocks],
          action: 'borrow',
          showResult: false,
          borrowed: true,
        });
      }
    }
  }

  // Step: Remove the blocks
  const remainingBlocks = performSubtraction(blocks1, blocks2, difficulty);
  steps.push({
    id: steps.length,
    description: `Remove ${num2} from the total:`,
    blocks: [remainingBlocks],
    action: 'remove-complete',
    showResult: false,
  });

  // Final result
  const difference = num1 - num2;
  steps.push({
    id: steps.length,
    description: `The final answer is ${difference}:`,
    blocks: [parseNumberToBlocks(difference, difficulty)],
    action: 'result',
    showResult: true,
  });

  return steps;
}

function shouldBorrow(blocks1: Block[], blocks2: Block[], difficulty: DifficultyLevel): boolean {
  const getOnesCount = (blocks: Block[]) =>
    blocks.filter(b => b.type === 'one')[0]?.count || 0;
  const getTensCount = (blocks: Block[]) =>
    blocks.filter(b => b.type === 'ten')[0]?.count || 0;
  const getHundredsCount = (blocks: Block[]) =>
    blocks.filter(b => b.type === 'hundred')[0]?.count || 0;

  const onesNeeded = getOnesCount(blocks2);
  const onesAvailable = getOnesCount(blocks1);

  if (difficulty === 'level1') {
    return onesNeeded > onesAvailable;
  } else {
    // For level 2, check if we need to borrow from tens
    const tensNeeded = getTensCount(blocks2);
    const tensAvailable = getTensCount(blocks1);

    if (onesNeeded > onesAvailable) {
      // Check if there are enough tens to borrow from
      return tensAvailable > 0 || getHundredsCount(blocks1) > 0;
    }

    return tensNeeded > tensAvailable;
  }
}

function performSubtraction(blocks1: Block[], blocks2: Block[], _difficulty: DifficultyLevel): Block[] {
  // Create copies of blocks
  let remainingBlocks = blocks1.map(b => ({ ...b }));
  const blocksToRemove = blocks2.map(b => ({ ...b }));

  // Remove blocks (simplified - in real animation, this would be more visual)
  blocksToRemove.forEach(removeBlock => {
    const matchingBlock = remainingBlocks.find(b => b.type === removeBlock.type);
    if (matchingBlock && matchingBlock.count >= removeBlock.count) {
      matchingBlock.count -= removeBlock.count;
      if (matchingBlock.count === 0) {
        remainingBlocks = remainingBlocks.filter(b => b.count > 0);
      }
    }
  });

  return remainingBlocks;
}