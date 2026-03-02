import React from 'react';

interface TenBlockProps {
  value?: number;
  className?: string;
}

export const TenBlock: React.FC<TenBlockProps> = ({
  value = 10,
  className = ''
}) => {
  return (
    <div
      className={`w-100 h-40 bg-green-500 border-2 border-green-700 rounded flex ${className}`}
      title={`Ten Block: ${value}`}
    >
      {/* Create 10 divisions to represent 10 ones */}
      <div className="flex w-full h-full">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex-1 border-r border-green-700 last:border-r-0"
            title={`Unit ${index + 1}`}
          />
        ))}
      </div>
      <span className="absolute text-white font-bold text-xs m-2">{value}</span>
    </div>
  );
};