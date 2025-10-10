import React from 'react';

import FormulaButton from '@/components/question/formula/formula-button';

interface GreekSymbolsProps {
  onSymbolClick: (symbol: string) => void;
}

export default function GreekSymbols({ onSymbolClick }: GreekSymbolsProps) {
  const symbols = [
    // Row 1
    { symbol: 'α', isSpecial: false },
    { symbol: 'β', isSpecial: false },
    { symbol: 'γ', isSpecial: false },
    { symbol: 'δ', isSpecial: false },
    { symbol: 'ε', isSpecial: false },
    { symbol: 'ζ', isSpecial: false },
    { symbol: 'η', isSpecial: false },
    { symbol: 'θ', isSpecial: false },
    { symbol: 'ι', isSpecial: false },
    // Row 2
    { symbol: 'κ', isSpecial: false },
    { symbol: 'λ', isSpecial: false },
    { symbol: 'μ', isSpecial: false },
    { symbol: 'ν', isSpecial: false },
    { symbol: 'ξ', isSpecial: false },
    { symbol: 'ο', isSpecial: false },
    { symbol: 'π', isSpecial: false },
    { symbol: 'ρ', isSpecial: false },
    { symbol: 'σ', isSpecial: false },
    // Row 3
    { symbol: 'τ', isSpecial: false },
    { symbol: 'υ', isSpecial: false },
    { symbol: 'φ', isSpecial: false },
    { symbol: 'χ', isSpecial: false },
    { symbol: 'ψ', isSpecial: false },
    { symbol: 'ω', isSpecial: false },
    { symbol: 'Γ', isSpecial: false },
    { symbol: 'Δ', isSpecial: false },
    { symbol: 'Θ', isSpecial: false },
    // Row 4
    { symbol: 'Λ', isSpecial: false },
    { symbol: 'Ξ', isSpecial: false },
    { symbol: 'Π', isSpecial: false },
    { symbol: 'Σ', isSpecial: false },
    { symbol: 'Φ', isSpecial: false },
    { symbol: 'Ψ', isSpecial: false },
    { symbol: 'Ω', isSpecial: false },
    { symbol: '', isSpecial: false },
    { symbol: '', isSpecial: false },
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
