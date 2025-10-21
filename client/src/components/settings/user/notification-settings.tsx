import React from 'react';

import { useUserContext } from './user-context';

import { SettingSection } from '@/components/settings/user/common/setting-section';
import { SettingItem } from '@/components/settings/user/common/setting-item';

export function NotificationSettings() {
  const { auth, handleNestedChange } = useUserContext();
  const user = auth.user;

  return (
    <div className='p-4 space-y-6'>
      <SettingSection title='Email Notifications'>
        <div className='space-y-3'>
          <SettingItem
            description='Receive notifications via email'
            isSelected={user?.notifications?.email ?? false}
            title='Email Notifications'
            onValueChange={(value: any) =>
              handleNestedChange('notifications', 'email', value)
            }
          />
          <SettingItem
            description='Receive push notifications on your devices'
            isSelected={user?.notifications?.push ?? false}
            title='Push Notifications'
            onValueChange={(value: any) =>
              handleNestedChange('notifications', 'push', value)
            }
          />
          <SettingItem
            description='Receive emails about new features and promotions'
            isSelected={user?.notifications?.marketing ?? false}
            title='Marketing Emails'
            onValueChange={(value: any) =>
              handleNestedChange('notifications', 'marketing', value)
            }
          />
        </div>
      </SettingSection>
    </div>
  );
}
