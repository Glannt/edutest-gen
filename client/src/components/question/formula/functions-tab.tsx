import React from 'react';

import FormulaButton from '@/components/question/formula/formula-button';

interface FunctionsTabProps {
  onSymbolClick: (symbol: string) => void;
}

export default function FunctionsTab({ onSymbolClick }: FunctionsTabProps) {
  const symbols = [
    // Row 1
    { symbol: 'sin', isSpecial: false },
    { symbol: 'sin<sup>-1</sup>', isSpecial: false },
    { symbol: 'ln', isSpecial: false },
    { symbol: 'e<sup>□</sup>', isSpecial: false },
    { symbol: 'lcm()', isSpecial: false },
    { symbol: 'ceil()', isSpecial: false },
    { symbol: '<span>lim<sub>n→∞</sub></span>', isSpecial: false },
    { symbol: '∫', isSpecial: false },
    { symbol: 'abs()', isSpecial: false },
    // Row 2
    { symbol: 'cos', isSpecial: false },
    { symbol: 'cos<sup>-1</sup>', isSpecial: false },
    { symbol: 'log', isSpecial: false },
    { symbol: '10<sup>□</sup>', isSpecial: false },
    { symbol: 'gcd()', isSpecial: false },
    { symbol: 'floor()', isSpecial: false },
    { symbol: '<span>∑<sub>n=0</sub><sup>∞</sup></span>', isSpecial: false },
    { symbol: '<span>∫<sub>0</sub><sup>∞</sup></span>', isSpecial: false },
    { symbol: 'sign()', isSpecial: false },
    // Row 3
    { symbol: 'tan', isSpecial: false },
    { symbol: 'tan<sup>-1</sup>', isSpecial: false },
    { symbol: 'log<sub>□</sub>', isSpecial: false },
    { symbol: '√□', isSpecial: false },
    { symbol: 'mod', isSpecial: false },
    { symbol: 'round()', isSpecial: false },
    { symbol: 'Π<sub>□</sub>', isSpecial: false },
    { symbol: '<span>d□<br>d<i>x</i></span>', isSpecial: false },
    { symbol: '*', isSpecial: false },
    // Row 4
    { symbol: '(', isSpecial: false },
    { symbol: ')', isSpecial: false },
    { symbol: 'x<sup>□</sup>', isSpecial: false },
    { symbol: 'x<sub>□</sub>', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: ',', isSpecial: false },
    { symbol: ';', isSpecial: false },
    { symbol: ':', isSpecial: false },
  ];

  return (
    <div className='grid grid-cols-9 gap-2 p-2 bg-black'>
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
