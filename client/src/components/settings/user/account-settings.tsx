import React, { useState } from 'react';
import { Button, Divider, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

import { SettingSection } from './common/setting-section';
import { useUserContext } from './user-context';

interface LinkedAccountProps {
  provider: string;
  icon: string;
  isConnected: boolean;
  onToggle?: () => void;
}

function LinkedAccount({
  provider,
  icon,
  isConnected,
  onToggle,
}: LinkedAccountProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Icon
          icon={icon}
          width={20}
        />
        <span>{provider}</span>
      </div>
      <Button
        size='sm'
        variant='flat'
        onPress={onToggle}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}

export function AccountSettings() {
  const { handleDeleteAccount } = useUserContext();

  // State local cho password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');

      return;
    }
    // TODO: call API update password
    console.log('Update password:', { currentPassword, newPassword });
  };

  return (
    <div className='p-4 space-y-6'>
      <SettingSection title='Password'>
        <div className='space-y-4'>
          <Input
            label='Current Password'
            placeholder='Enter current password'
            type='password'
            value={currentPassword}
            onValueChange={setCurrentPassword}
          />
          <Input
            label='New Password'
            placeholder='Enter new password'
            type='password'
            value={newPassword}
            onValueChange={setNewPassword}
          />
          <Input
            label='Confirm New Password'
            placeholder='Confirm new password'
            type='password'
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />
          <div>
            <Button
              color='primary'
              size='sm'
              onPress={handleUpdatePassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </SettingSection>

      <Divider />

      <SettingSection title='Linked Accounts'>
        <div className='space-y-3'>
          <LinkedAccount
            icon='logos:google-icon'
            isConnected={false}
            provider='Google'
          />
          <LinkedAccount
            icon='logos:facebook'
            isConnected={false}
            provider='Facebook'
          />
          <LinkedAccount
            icon='logos:apple'
            isConnected={false}
            provider='Apple'
          />
        </div>
      </SettingSection>

      <Divider />

      <SettingSection
        title='Danger Zone'
        titleColor='danger'
      >
        <div className='space-y-2'>
          <p className='text-sm text-default-500'>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            color='danger'
            variant='flat'
            onPress={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </SettingSection>
    </div>
  );
}
