import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';

import { UserPayload } from '@/types/user';

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: UserPayload;
  handleInputChange: <K extends keyof UserPayload>(
    field: K,
    value: UserPayload[K]
  ) => void;
  handleSubmit: () => void;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  handleInputChange,
  handleSubmit,
}: EditUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader>Chỉnh sửa người dùng</ModalHeader>
          <ModalBody>
            <Input
              label='Tên tài khoản'
              value={user.username}
              onValueChange={(val) => handleInputChange('username', val)}
            />
            <Input
              label='Họ tên'
              value={user.full_name}
              onValueChange={(val) => handleInputChange('full_name', val)}
            />
            <Input
              label='Email'
              type='email'
              value={user.email}
              onValueChange={(val) => handleInputChange('email', val)}
            />
            <Select
              label='Vai trò'
              selectedKeys={new Set([user.role || 'TEACHER'])} // Giá trị mặc định nếu user.role null
              onChange={(e) =>
                handleInputChange('role', e.target.value as UserPayload['role'])
              }
            >
              <SelectItem key='TEACHER'>Giáo viên</SelectItem>
              <SelectItem key='ADMIN'>Quản trị viên</SelectItem>
            </Select>
            <Select
              label='Trạng thái'
              selectedKeys={new Set([user.isActive ? 'active' : 'inactive'])}
              onChange={(e) =>
                handleInputChange('isActive', e.target.value === 'active')
              }
            >
              <SelectItem key='active'> Hoạt động</SelectItem>
              <SelectItem key='inactive'>Ngừng hoạt động</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              onPress={onOpenChange.bind(null, false)}
            >
              Hủy
            </Button>
            <Button
              color='primary'
              onPress={handleSubmit}
            >
              Lưu thay đổi
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
