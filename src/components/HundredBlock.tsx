import React from 'react';

interface HundredBlockProps {
  value?: number;
  className?: string;
}

export const HundredBlock: React.FC<HundredBlockProps> = ({
  value = 100,
  className = ''
}) => {
  return (
    <div
      className={`w-100 h-100 bg-orange-500 border-2 border-orange-700 rounded relative ${className}`}
      title={`Hundred Block: ${value}`}
    >
      {/* Create 10x10 grid to represent 100 ones */}
      <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
        {[...Array(100)].map((_, index) => (
          <div
            key={index}
            className="border border-orange-700"
            title={`Unit ${index + 1}`}
          />
        ))}
      </div>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
        {value}
      </span>
    </div>
  );
};