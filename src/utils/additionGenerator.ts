import { Block, BlockType, DifficultyLevel, AnimationStep } from '../types';
import { parseNumberToBlocks } from './numberParser';

interface AdditionStep extends AnimationStep {
  carryOver?: boolean;
  highlightedBlocks?: number[];
}

export function generateAdditionAnimation(
  num1: number,
  num2: number,
  difficulty: DifficultyLevel
): AdditionStep[] {
  const steps: AdditionStep[] = [];
  const blocks1 = parseNumberToBlocks(num1, difficulty);
  const blocks2 = parseNumberToBlocks(num2, difficulty);

  // Step 0: Show the problem
  steps.push({
    id: 0,
    description: `Add ${num1} + ${num2}`,
    blocks: [blocks1, blocks2],
    action: 'show',
    showResult: false,
  });

  // Step 1: Show first number
  steps.push({
    id: 1,
    description: `First, we show ${num1}:`,
    blocks: [blocks1],
    action: 'display',
    showResult: false,
  });

  // Step 2: Add second number blocks
  steps.push({
    id: 2,
    description: `Now, add ${num2} by bringing in these blocks:`,
    blocks: [blocks1, blocks2],
    action: 'add',
    showResult: false,
  });

  // Check if we need regrouping
  const sum = num1 + num2;
  const needRegrouping = shouldRegroup(blocks1, blocks2, difficulty);

  if (needRegrouping) {
    let currentBlocks = [...blocks1, ...blocks2];

    // Step 3: Identify and regroup blocks
    steps.push({
      id: 3,
      description: 'Some blocks can be regrouped:',
      blocks: [currentBlocks],
      action: 'regroup',
      showResult: false,
    });

    // Regroup ones to tens
    const onesCount = currentBlocks
      .filter(b => b.type === 'one')
      .reduce((sum, b) => sum + b.count, 0);

    if (onesCount >= 10) {
      const tensFromOnes = Math.floor(onesCount / 10);
      const remainingOnes = onesCount % 10;

      // Remove ones and add tens
      currentBlocks = [
        ...currentBlocks.filter(b => b.type !== 'one') as Block[],
        { type: 'ten' as BlockType, value: 10, count: tensFromOnes },
        ...(remainingOnes > 0 ? [{ type: 'one' as BlockType, value: 1, count: remainingOnes }] : [])
      ];

      steps.push({
        id: 4,
        description: `Regroup 10 ones into 1 ten. We regrouped ${tensFromOnes} time(s).`,
        blocks: [currentBlocks],
        action: 'regroup-complete',
        showResult: false,
        carryOver: true,
      });
    }

    // Regroup tens to hundreds (for level 2)
    if (difficulty === 'level2') {
      const tensCount = currentBlocks
        .filter(b => b.type === 'ten')
        .reduce((sum, b) => sum + b.count, 0);

      if (tensCount >= 10) {
        const hundredsFromTens = Math.floor(tensCount / 10);
        const remainingTens = tensCount % 10;

        // Remove tens and add hundreds
        currentBlocks = [
          ...currentBlocks.filter(b => b.type !== 'ten') as Block[],
          { type: 'hundred' as BlockType, value: 100, count: hundredsFromTens },
          ...(remainingTens > 0 ? [{ type: 'ten' as BlockType, value: 10, count: remainingTens }] : [])
        ];

        steps.push({
          id: 5,
          description: `Regroup 10 tens into 1 hundred. We regrouped ${hundredsFromTens} time(s).`,
          blocks: [currentBlocks],
          action: 'regroup-complete',
          showResult: false,
          carryOver: true,
        });
      }
    }

    // Final result
    steps.push({
      id: 6,
      description: `The final answer is ${sum}:`,
      blocks: [parseNumberToBlocks(sum, difficulty)],
      action: 'result',
      showResult: true,
    });
  } else {
    // Simple addition without regrouping
    steps.push({
      id: 3,
      description: `Count all blocks together to get ${sum}:`,
      blocks: [parseNumberToBlocks(sum, difficulty)],
      action: 'result',
      showResult: true,
    });
  }

  return steps;
}

function shouldRegroup(blocks1: Block[], blocks2: Block[], difficulty: DifficultyLevel): boolean {
  const allBlocks = [...blocks1, ...blocks2];

  if (difficulty === 'level1') {
    const onesCount = allBlocks
      .filter(b => b.type === 'one')
      .reduce((sum, b) => sum + b.count, 0);
    return onesCount >= 10;
  } else {
    const onesCount = allBlocks
      .filter(b => b.type === 'one')
      .reduce((sum, b) => sum + b.count, 0);
    const tensCount = allBlocks
      .filter(b => b.type === 'ten')
      .reduce((sum, b) => sum + b.count, 0);

    return onesCount >= 10 || tensCount >= 10;
  }
}