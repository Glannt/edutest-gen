import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectSettingProps {
  title: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function SelectSetting({
  title,
  description,
  value,
  options,
  onChange,
}: SelectSettingProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <p className='font-medium'>{title}</p>
        {description && (
          <p className='text-sm text-default-500'>{description}</p>
        )}
      </div>
      <select
        className='bg-content1 border border-default-200 rounded-md px-3 py-1.5 text-sm'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
