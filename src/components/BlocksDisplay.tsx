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
  // Flatten blocks if they're nested
  const flattenedBlocks: Block[] = Array.isArray(blocks[0]) && Array.isArray((blocks as Block[][])[0][0]) ?
    (blocks as Block[][]).flat() :
    blocks as Block[];

  const renderBlock = (block: Block, index: number) => {
    const BlockComponent = BlockComponents[block.type];
    if (!BlockComponent) return null;

    const isHighlighted = flattenedBlocks.filter(b => b.type === block.type).length > 1 && index > 0;
    const blockKey = `${block.type}-${index}`;

    return (
      <div
        key={blockKey}
        className={`inline-flex flex-col items-center m-1 p-1 ${
          isHighlighted ? 'ring-2 ring-yellow-400 rounded' : ''
        }`}
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
  };

  return (
    <div className={`flex flex-wrap justify-center items-center gap-2 p-4 ${className}`}>
      {flattenedBlocks.map((block, index) => (
        <React.Fragment key={`${block.type}-${index}`}>
          {Array(block.count).fill(null).map((_, i) => renderBlock(block, i))}
        </React.Fragment>
      ))}
      {flattenedBlocks.length === 0 && (
        <div className="text-gray-500 text-center p-8">
          <p>No blocks to display</p>
          <p className="text-sm">Enter a number to see base-10 blocks</p>
        </div>
      )}
    </div>
  );
};