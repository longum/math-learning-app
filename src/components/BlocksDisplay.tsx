import React from 'react';
import { OneBlock } from './OneBlock';
import { TenBlock } from './TenBlock';
import { HundredBlock } from './HundredBlock';
import { Block } from '../types';

interface BlocksDisplayProps {
  blocks?: Block[][] | Block[];
  className?: string;
  showValue?: boolean;
}

const BlockComponents = {
  one: OneBlock,
  ten: TenBlock,
  hundred: HundredBlock,
};

export const BlocksDisplay: React.FC<BlocksDisplayProps> = ({
  blocks = [],
  className = '',
  showValue = true,
}) => {
  // Normalize to Block[] - flatten if nested
  let normalizedBlocks: Block[];

  if (blocks.length === 0) {
    normalizedBlocks = [];
  } else if (Array.isArray(blocks[0])) {
    // It's Block[][], flatten it
    normalizedBlocks = (blocks as Block[][]).flat();
  } else {
    // It's already Block[]
    normalizedBlocks = blocks as Block[];
  }

  if (normalizedBlocks.length === 0) {
    return (
      <div className={`flex flex-wrap justify-center items-center gap-2 p-4 ${className}`}>
        <div className="text-gray-500 text-center p-8">
          <p>No blocks to display</p>
          <p className="text-sm">Enter a number to see base-10 blocks</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center items-center gap-4 p-4 ${className}`}>
      {normalizedBlocks.map((block, index) => {
        const BlockComponent = BlockComponents[block.type];
        if (!BlockComponent) return null;

        const blockKey = `${block.type}-${index}`;

        return (
          <div
            key={blockKey}
            className="inline-flex flex-col items-center m-1 p-2"
            title={`${block.type} block: ${block.value} × ${block.count}`}
          >
            <BlockComponent
              value={showValue ? block.value : undefined}
              className="transition-all duration-300 hover:scale-105"
            />
            {showValue && block.count > 1 && (
              <span className="text-xs mt-1 font-semibold text-gray-600">
                ×{block.count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};