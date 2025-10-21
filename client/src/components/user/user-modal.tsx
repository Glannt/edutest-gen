import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
} from '@heroui/react';

import { UserInterface } from '@/interface/user.interface';

interface UserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleInputChange: (field: string, value: string) => void;
  handleModalClose: () => void;
  handleSubmit: () => void;
  newUser: Partial<UserInterface>;
}

export default function UserModal({
  isOpen,
  onOpenChange,
  handleInputChange,
  handleModalClose,
  handleSubmit,
  newUser,
}: UserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader>Thêm người dùng mới</ModalHeader>
          <ModalBody>
            <Input
              label='Họ tên'
              value={newUser.username || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <Input
              label='Email'
              type='email'
              value={newUser.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <Input
              label='Vai trò'
              value={newUser.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
            />
            <Select
              label='Trạng thái'
              selectedKeys={[newUser.isActive ? 'active' : 'inactive']}
              onChange={(e) => handleInputChange('isActive', e.target.value)}
            >
              <SelectItem key='active'>Hoạt động</SelectItem>
              <SelectItem key='inactive'>Ngừng hoạt động</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              onPress={handleModalClose}
            >
              Hủy
            </Button>
            <Button
              color='primary'
              onPress={handleSubmit}
            >
              Lưu
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
