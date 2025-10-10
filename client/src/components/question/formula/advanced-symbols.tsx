import React from 'react';

import FormulaButton from '@/components/question/formula/formula-button';

interface AdvancedSymbolsProps {
  onSymbolClick: (symbol: string) => void;
}

export default function AdvancedSymbols({
  onSymbolClick,
}: AdvancedSymbolsProps) {
  const symbols = [
    // Row 1
    { symbol: '7', isSpecial: false },
    { symbol: '8', isSpecial: false },
    { symbol: '9', isSpecial: false },
    { symbol: '÷', isSpecial: false },
    { symbol: '{', isSpecial: false },
    { symbol: '}', isSpecial: false },
    { symbol: '←', isSpecial: false },
    { symbol: '→', isSpecial: false },
    {
      symbol: "<span><span style='text-decoration:overline'>□</span></span>",
      isSpecial: false,
    },
    {
      symbol: "<span><span style='text-decoration:underline'>□</span></span>",
      isSpecial: false,
    },
    { symbol: '⌈□⌉', isSpecial: false },
    { symbol: '∇', isSpecial: false },
    { symbol: '∞', isSpecial: false },
    // Row 2
    { symbol: '4', isSpecial: false },
    { symbol: '5', isSpecial: false },
    { symbol: '6', isSpecial: false },
    { symbol: '×', isSpecial: false },
    { symbol: '[', isSpecial: false },
    { symbol: ']', isSpecial: false },
    { symbol: '∈', isSpecial: false },
    { symbol: '∉', isSpecial: false },
    { symbol: 'ℜ', isSpecial: false },
    { symbol: 'ℑ', isSpecial: false },
    { symbol: '⌊□⌋', isSpecial: false },
    { symbol: '∂', isSpecial: false },
    { symbol: '∅', isSpecial: false },
    // Row 3
    { symbol: '1', isSpecial: false },
    { symbol: '2', isSpecial: false },
    { symbol: '3', isSpecial: false },
    { symbol: '−', isSpecial: false },
    { symbol: '⟨', isSpecial: false },
    { symbol: '⟩', isSpecial: false },
    { symbol: '⊂', isSpecial: false },
    { symbol: '⊃', isSpecial: false },
    { symbol: '→', isSpecial: false },
    { symbol: '|□|', isSpecial: false },
    { symbol: '!', isSpecial: false },
    { symbol: '/', isSpecial: false },
    { symbol: '*', isSpecial: false },
    // Row 4
    { symbol: '0', isSpecial: false },
    { symbol: '.', isSpecial: false },
    { symbol: '=', isSpecial: false },
    { symbol: '+', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: '·', isSpecial: false },
    { symbol: ':', isSpecial: false },
    { symbol: '○', isSpecial: false },
    { symbol: '≈', isSpecial: false },
    { symbol: '≠', isSpecial: false },
    { symbol: '±', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
  ];

  return (
    <div className='grid grid-cols-13 gap-2 p-2 bg-black'>
      {symbols.map((item, index) => (
        <FormulaButton
          key={index}
          //   color={item.color}
          isSpecial={item.isSpecial}
          symbol={item.symbol}
          onClick={onSymbolClick}
        />
      ))}
    </div>
  );
}
