import React from 'react';

interface FormulaButtonProps {
  symbol: string;
  onClick: (symbol: string) => void;
  isSpecial?: boolean;
  color?: string;
}

export default function FormulaButton({
  symbol,
  onClick,
  isSpecial = false,
  color,
}: FormulaButtonProps) {
  return (
    <button
      className={`flex items-center justify-center p-3 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors text-white ${
        isSpecial ? 'border' : ''
      } ${color ? `border-${color}-500` : ''}`}
      onClick={() => onClick(symbol)}
    >
      <span
        dangerouslySetInnerHTML={{ __html: symbol }}
        className='text-lg'
      />
    </button>
  );
}
