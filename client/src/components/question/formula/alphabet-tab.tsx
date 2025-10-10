import React from 'react';

import FormulaButton from '@/components/question/formula/formula-button';

interface AlphabetTabProps {
  onSymbolClick: (symbol: string) => void;
}

export default function AlphabetTab({ onSymbolClick }: AlphabetTabProps) {
  const symbols = [
    // Row 1
    { symbol: '7', isSpecial: false },
    { symbol: '8', isSpecial: false },
    { symbol: '9', isSpecial: false },
    { symbol: '÷', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: 'p', isSpecial: false },
    { symbol: 'y', isSpecial: false },
    { symbol: 'f', isSpecial: false },
    { symbol: 'g', isSpecial: false },
    { symbol: 'c', isSpecial: false },
    { symbol: 'r', isSpecial: false },
    { symbol: 'l', isSpecial: false },
    // Row 2
    { symbol: '4', isSpecial: false },
    { symbol: '5', isSpecial: false },
    { symbol: '6', isSpecial: false },
    { symbol: '×', isSpecial: false },
    { symbol: 'a', isSpecial: false },
    { symbol: 'o', isSpecial: false },
    { symbol: 'e', isSpecial: false },
    { symbol: 'u', isSpecial: false },
    { symbol: 'i', isSpecial: false },
    { symbol: 'd', isSpecial: false },
    { symbol: 'h', isSpecial: false },
    { symbol: 't', isSpecial: false },
    { symbol: 'n', isSpecial: false },
    { symbol: 's', isSpecial: false },
    // Row 3
    { symbol: '1', isSpecial: false },
    { symbol: '2', isSpecial: false },
    { symbol: '3', isSpecial: false },
    { symbol: '−', isSpecial: false },
    { symbol: 'q', isSpecial: false },
    { symbol: 'j', isSpecial: false },
    { symbol: 'k', isSpecial: false },
    { symbol: 'x', isSpecial: false },
    { symbol: 'b', isSpecial: false },
    { symbol: 'm', isSpecial: false },
    { symbol: 'w', isSpecial: false },
    { symbol: 'v', isSpecial: false },
    { symbol: 'z', isSpecial: false },
    { symbol: '*', isSpecial: false },
    // Row 4
    { symbol: '0', isSpecial: false },
    { symbol: '.', isSpecial: false },
    { symbol: '=', isSpecial: false },
    { symbol: '+', isSpecial: false },
    { symbol: ':', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
  ];

  return (
    <div className='grid grid-cols-14 gap-2 p-2 bg-black'>
      {symbols.map((item, index) =>
        item.symbol ? (
          <FormulaButton
            key={index}
            // color={item.color}
            isSpecial={item.isSpecial}
            symbol={item.symbol}
            onClick={onSymbolClick}
          />
        ) : (
          <div
            key={index}
            className='h-12'
          />
        )
      )}
    </div>
  );
}
