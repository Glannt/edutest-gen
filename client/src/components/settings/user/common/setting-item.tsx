import React from 'react';
import { Switch } from '@heroui/react';

interface SettingItemProps {
  title: string;
  description: string;
  isSelected: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingItem({
  title,
  description,
  isSelected,
  onValueChange,
}: SettingItemProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <p className='font-medium'>{title}</p>
        <p className='text-sm text-default-500'>{description}</p>
      </div>
      <Switch
        isSelected={isSelected}
        onValueChange={onValueChange}
      />
    </div>
  );
}
