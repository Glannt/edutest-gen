import React from 'react';
import { Divider } from '@heroui/react';

import { useUserContext } from './user-context';

import { SettingSection } from '@/components/settings/user/common/setting-section';
import { SettingItem } from '@/components/settings/user/common/setting-item';
import { SelectSetting } from '@/components/settings/user/common/select-setting';

export function AppearanceSettings() {
  const { auth, handleNestedChange } = useUserContext();
  const user = auth.user;
  const languageOptions = [
    { value: 'en', label: 'English (US)' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
  ];

  const timezoneOptions = [
    { value: 'utc', label: 'UTC (Coordinated Universal Time)' },
    { value: 'est', label: 'EST (Eastern Standard Time)' },
    { value: 'pst', label: 'PST (Pacific Standard Time)' },
    { value: 'cet', label: 'CET (Central European Time)' },
    { value: 'jst', label: 'JST (Japan Standard Time)' },
  ];

  return (
    <div className='p-4 space-y-6'>
      <SettingSection title='Display Settings'>
        <div className='space-y-3'>
          <SettingItem
            description='Use dark theme'
            isSelected={user?.appearance?.darkMode ?? false}
            title='Dark Mode'
            onValueChange={(value) =>
              handleNestedChange('appearance', 'darkMode', value)
            }
          />
          <SettingItem
            description='Reduce spacing between items'
            isSelected={user?.appearance?.compactMode ?? false}
            title='Compact Mode'
            onValueChange={(value) =>
              handleNestedChange('appearance', 'compactMode', value)
            }
          />
          <SettingItem
            description='Increase contrast for better visibility'
            isSelected={user?.appearance?.highContrast ?? false}
            title='High Contrast'
            onValueChange={(value) =>
              handleNestedChange('appearance', 'highContrast', value)
            }
          />
        </div>
      </SettingSection>

      <Divider />

      <SettingSection title='Language & Region'>
        <div className='space-y-4'>
          <SelectSetting
            options={languageOptions}
            title='Language'
            value='en'
            onChange={() => {}}
          />
          <SelectSetting
            options={timezoneOptions}
            title='Time Zone'
            value='utc'
            onChange={() => {}}
          />
        </div>
      </SettingSection>
    </div>
  );
}
