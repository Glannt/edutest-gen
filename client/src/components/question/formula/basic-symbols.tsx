import React from 'react';

import FormulaButton from '@/components/question/formula/formula-button';

interface BasicSymbolsProps {
  onSymbolClick: (symbol: string) => void;
}

export default function BasicSymbols({ onSymbolClick }: BasicSymbolsProps) {
  const symbols = [
    // Row 1
    { symbol: 'x', isSpecial: false },
    { symbol: 'n', isSpecial: false },
    { symbol: '7', isSpecial: false },
    { symbol: '8', isSpecial: false },
    { symbol: '9', isSpecial: false },
    { symbol: '÷', isSpecial: false },
    { symbol: 'e', isSpecial: false },
    { symbol: 'i', isSpecial: false },
    { symbol: 'π', isSpecial: false },
    // Row 2
    { symbol: '&lt;', isSpecial: false },
    { symbol: '&gt;', isSpecial: false },
    { symbol: '4', isSpecial: false },
    { symbol: '5', isSpecial: false },
    { symbol: '6', isSpecial: false },
    { symbol: '×', isSpecial: false },
    { symbol: '<span>□<sup>2</sup></span>', isSpecial: false },
    { symbol: '<span>x<sup>□</sup></span>', isSpecial: false },
    { symbol: '<span>√□</span>', isSpecial: false },
    // Row 3
    { symbol: '(', isSpecial: false },
    { symbol: ')', isSpecial: false },
    { symbol: '1', isSpecial: false },
    { symbol: '2', isSpecial: false },
    { symbol: '3', isSpecial: false },
    { symbol: '−', isSpecial: false },
    { symbol: '<span>∫<sub>0</sub><sup>∞</sup></span>', isSpecial: false },
    { symbol: '∀', isSpecial: false },
    { symbol: '*', isSpecial: false },
    // Row 4
    { symbol: 'O', isSpecial: true, color: 'red' },
    { symbol: '●', isSpecial: true, color: 'yellow' },
    { symbol: '0', isSpecial: false },
    { symbol: '.', isSpecial: false },
    { symbol: '=', isSpecial: false },
    { symbol: '+', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: ';', isSpecial: false },
    { symbol: ':', isSpecial: false },
  ];

  return (
    <div className='grid grid-cols-9 gap-2 p-2 bg-black'>
      {symbols.map((item, index) => (
        <FormulaButton
          key={index}
          color={item.color}
          isSpecial={item.isSpecial}
          symbol={item.symbol}
          onClick={onSymbolClick}
        />
      ))}
    </div>
  );
}
