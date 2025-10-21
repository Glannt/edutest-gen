import React from 'react';
import { Avatar, Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useUserContext } from './user-context';

export function ProfileSettings() {
  const { auth, handleInputChange } = useUserContext();
  const user = auth.user;

  console.log('auth', auth);

  return (
    <div className='p-4 space-y-6'>
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex flex-col items-center gap-3'>
          <Avatar
            isBordered
            className='w-24 h-24'
            // src={user?.avatar}
          />
          <Button
            size='sm'
            startContent={<Icon icon='lucide:upload' />}
            variant='flat'
          >
            Change Photo
          </Button>
        </div>
        <div className='flex-1 space-y-4'>
          <Input
            label='Full Name'
            value={user?.full_name}
            onValueChange={(value) => handleInputChange('full_name', value)}
          />
          <Input
            label='Email Address'
            value={user?.email}
            onValueChange={(value) => handleInputChange('email', value)}
          />
          <Input
            label='Username'
            placeholder='Username'
            value={user?.username}
            onValueChange={(value) => handleInputChange('username', value)}
          />
          <Input
            label='Bio'
            placeholder='Tell us about yourself'
            type='textarea'
          />
        </div>
      </div>
    </div>
  );
}
