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
    { symbol: '\\div', isSpecial: false },
    { symbol: '\\{', isSpecial: false },
    { symbol: '\\}', isSpecial: false },
    { symbol: '\\leftarrow', isSpecial: false },
    { symbol: '\\rightarrow', isSpecial: false },
    { symbol: '\\overline{□}', isSpecial: false },
    { symbol: '\\underline{□}', isSpecial: false },
    { symbol: '\\lceil □ \\rceil', isSpecial: false },
    { symbol: '\\nabla', isSpecial: false },
    { symbol: '\\infty', isSpecial: false },

    // Row 2
    { symbol: '4', isSpecial: false },
    { symbol: '5', isSpecial: false },
    { symbol: '6', isSpecial: false },
    { symbol: '\\times', isSpecial: false },
    { symbol: '[', isSpecial: false },
    { symbol: ']', isSpecial: false },
    { symbol: '\\in', isSpecial: false },
    { symbol: '\\notin', isSpecial: false },
    { symbol: '\\Re', isSpecial: false },
    { symbol: '\\Im', isSpecial: false },
    { symbol: '\\lfloor □ \\rfloor', isSpecial: false },
    { symbol: '\\partial', isSpecial: false },
    { symbol: '\\emptyset', isSpecial: false },

    // Row 3
    { symbol: '1', isSpecial: false },
    { symbol: '2', isSpecial: false },
    { symbol: '3', isSpecial: false },
    { symbol: '-', isSpecial: false },
    { symbol: '\\langle', isSpecial: false },
    { symbol: '\\rangle', isSpecial: false },
    { symbol: '\\subset', isSpecial: false },
    { symbol: '\\supset', isSpecial: false },
    { symbol: '\\rightarrow', isSpecial: false },
    { symbol: '\\lvert □ \\rvert', isSpecial: false },
    { symbol: '!', isSpecial: false },
    { symbol: '/', isSpecial: false },
    { symbol: '\\ast', isSpecial: false },

    // Row 4
    { symbol: '0', isSpecial: false },
    { symbol: '.', isSpecial: false },
    { symbol: '=', isSpecial: false },
    { symbol: '+', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: '\\cdot', isSpecial: false },
    { symbol: ':', isSpecial: false },
    { symbol: '\\circ', isSpecial: false },
    { symbol: '\\approx', isSpecial: false },
    { symbol: '\\neq', isSpecial: false },
    { symbol: '\\pm', isSpecial: false },
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
