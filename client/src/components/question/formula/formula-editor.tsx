import React from 'react';
import { Tabs, Tab, Input } from '@heroui/react';

import BasicSymbols from '@/components/question/formula/basic-symbols';
import FunctionsTab from '@/components/question/formula/functions-tab';
import AdvancedSymbols from '@/components/question/formula/advanced-symbols';
import AlphabetTab from '@/components/question/formula/alphabet-tab';
import GreekSymbols from '@/components/question/formula/greek-symbols';

interface FormulaEditorProps {
  formula: string;
  setFormula: (formula: string) => void;
}

export default function FormulaEditor({
  formula,
  setFormula,
}: FormulaEditorProps) {
  const handleSymbolClick = (symbol: string) => {
    setFormula(formula + symbol);
  };

  return (
    <div className='flex flex-col gap-4'>
      <Input
        className='w-full'
        placeholder='Nhập công thức...'
        size='lg'
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
      />

      <Tabs
        aria-label='Formula categories'
        className='w-full'
        color='primary'
      >
        <Tab
          key='numbers'
          title={<span className='text-blue-500 font-medium'>123</span>}
        >
          <BasicSymbols onSymbolClick={handleSymbolClick} />
        </Tab>
        <Tab
          key='functions'
          title={<span className='text-blue-500 font-medium'>f()</span>}
        >
          <FunctionsTab onSymbolClick={handleSymbolClick} />
        </Tab>
        <Tab
          key='math'
          title={<span className='text-blue-500 font-medium'>∞≠∈</span>}
        >
          <AdvancedSymbols onSymbolClick={handleSymbolClick} />
        </Tab>
        <Tab
          key='abc'
          title={<span className='text-blue-500 font-medium'>ABC</span>}
        >
          <AlphabetTab onSymbolClick={handleSymbolClick} />
        </Tab>
        <Tab
          key='greek'
          title={<span className='text-blue-500 font-medium'>αβγ</span>}
        >
          <GreekSymbols onSymbolClick={handleSymbolClick} />
        </Tab>
      </Tabs>
    </div>
  );
}
