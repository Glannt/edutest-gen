import React from 'react';
import { Checkbox, Divider } from '@heroui/react';

import { useUserContext } from './user-context';

import { SettingSection } from '@/components/settings/user/common/setting-section';
import { SelectSetting } from '@/components/settings/user/common/select-setting';
import { SettingItem } from '@/components/settings/user/common/setting-item';

export function PrivacySettings() {
  const { auth, handleNestedChange } = useUserContext();
  const user = auth.user;

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' },
  ];

  return (
    <div className='p-4 space-y-6'>
      <SettingSection title='Privacy Settings'>
        <div className='space-y-3'>
          <SelectSetting
            description='Control who can see your profile'
            options={visibilityOptions}
            title='Profile Visibility'
            value={user?.privacy?.profileVisibility ?? 'public'}
            onChange={(value) =>
              handleNestedChange('privacy', 'profileVisibility', value)
            }
          />
          <SettingItem
            description="Show when you're active"
            isSelected={user?.privacy?.activityStatus ?? true}
            title='Online Status'
            onValueChange={(value) =>
              handleNestedChange('privacy', 'activityStatus', value)
            }
          />
          <SettingItem
            description='Show when you were last online'
            isSelected={user?.privacy?.showLastSeen ?? true}
            title='Last Seen'
            onValueChange={(value) =>
              handleNestedChange('privacy', 'showLastSeen', value)
            }
          />
        </div>
      </SettingSection>

      <Divider />

      <SettingSection title='Data & Personalization'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Data Collection</p>
              <p className='text-sm text-default-500'>
                Allow us to collect usage data to improve our services
              </p>
            </div>
            <Checkbox defaultSelected>Opt-in</Checkbox>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Personalized Ads</p>
              <p className='text-sm text-default-500'>
                Allow personalized ads based on your activity
              </p>
            </div>
            <Checkbox defaultSelected>Opt-in</Checkbox>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
