import React from 'react';
import { Card, Tabs, Tab, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';

import { ProfilePage } from '@/components/settings/user/profile-settings';
import { AccountSettings } from '@/components/settings/user/account-settings';
import { NotificationSettings } from '@/components/settings/user/notification-settings';
import { PrivacySettings } from '@/components/settings/user/privacy-settings';
import { AppearanceSettings } from '@/components/settings/user/appearance-settings';

export function UserSettingsPage() {
  const [selected, setSelected] = React.useState('profile');
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { auth, handleInputChange, handleNestedChange, handleDeleteAccount } =
  //   useUserContext(); // Lấy trực tiếp từ context

  const handleSaveChanges = () => {
    addToast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully',
      color: 'success',
    });
  };

  return (
    <div className='max-w-5xl mx-auto p-4 md:p-6'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Account Settings</h1>
          {/* <Button
            color='primary'
            onPress={handleSaveChanges}
          >
            Save Changes
          </Button> */}
        </div>

        <Card className='p-0'>
          <Tabs
            aria-label='Settings options'
            className='p-0'
            classNames={{ tabList: 'px-4 pt-4', panel: 'p-0' }}
            color='primary'
            selectedKey={selected}
            variant='underlined'
            onSelectionChange={(key) => setSelected(String(key))}
          >
            <Tab
              key='profile'
              title={
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:user'
                    width={18}
                  />
                  <span>Thông tin cá nhân</span>
                </div>
              }
            >
              <ProfilePage />
            </Tab>

            <Tab
              key='account'
              title={
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:settings'
                    width={18}
                  />
                  <span>Tài khoản</span>
                </div>
              }
            >
              <AccountSettings />
            </Tab>

            <Tab
              key='notifications'
              title={
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:bell'
                    width={18}
                  />
                  <span>Notifications</span>
                </div>
              }
            >
              <NotificationSettings />
            </Tab>

            <Tab
              key='privacy'
              title={
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:shield'
                    width={18}
                  />
                  <span>Privacy</span>
                </div>
              }
            >
              <PrivacySettings />
            </Tab>

            <Tab
              key='appearance'
              title={
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:palette'
                    width={18}
                  />
                  <span>Appearance</span>
                </div>
              }
            >
              <AppearanceSettings />
            </Tab>
          </Tabs>
        </Card>
      </div>

      {/* <DeleteAccountModal
        isOpen={isOpen}
        onDelete={handleDeleteAccount}
        onOpenChange={onOpenChange}
      /> */}
    </div>
  );
}
