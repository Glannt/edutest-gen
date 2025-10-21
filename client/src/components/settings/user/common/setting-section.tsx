import React from 'react';

interface SettingSectionProps {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
}

export function SettingSection({
  title,
  titleColor = 'default',
  children,
}: SettingSectionProps) {
  const colorClass = titleColor === 'danger' ? 'text-danger' : '';

  return (
    <div className='space-y-4'>
      <h3 className={`text-lg font-medium ${colorClass}`}>{title}</h3>
      {children}
    </div>
  );
}
