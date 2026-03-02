import React from 'react';

interface OneBlockProps {
  value?: number;
  className?: string;
}

export const OneBlock: React.FC<OneBlockProps> = ({
  value = 1,
  className = ''
}) => {
  return (
    <div
      className={`w-10 h-40 bg-blue-500 border-2 border-blue-700 rounded-sm flex items-center justify-center ${className}`}
      title={`One Block: ${value}`}
    >
      <span className="text-white font-bold text-xs">{value}</span>
    </div>
  );
};