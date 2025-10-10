import { useState, useEffect } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import {
  Spacer,
  Select,
  SelectItem,
  addToast,
  CircularProgress,
} from '@heroui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { LockIcon, MailIcon } from '@/components/icons';
import { useRegister } from '@/hooks/useRegister';
import { RegisterPayload } from '@/service/auth.service';

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function RegisterModal({
  isOpen,
  onOpenChange,
}: RegisterModalProps) {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  // ✅ form có thêm role (dùng riêng, không gửi trong payload)
  const [form, setForm] = useState<
    RegisterPayload & { role: 'ADMIN' | 'TEACHER' }
  >({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'TEACHER',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Truyền payload + role tách biệt (đúng kiểu useRegister)
    registerMutation.mutate({
      payload: {
        username: form.username,
        email: form.email,
        password: form.password,
        full_name: form.full_name,
      },
      role: form.role,
    });
  };

  useEffect(() => {
    if (registerMutation.isSuccess) {
      addToast({
        title: '🎉 Đăng ký thành công!',
        description: 'Bạn có thể đăng nhập ngay bây giờ.',
        color: 'success',
        timeout: 2000,
      });
      navigate('/'); // hoặc mở LoginModal
    }

    if (registerMutation.isError) {
      addToast({
        title: 'Đăng ký thất bại',
        description: 'Vui lòng kiểm tra lại thông tin và thử lại.',
        color: 'danger',
        timeout: 3000,
      });
    }
  }, [registerMutation.isSuccess, registerMutation.isError, navigate]);

  return (
    <Modal
      backdrop='opaque'
      className='max-w-6xl w-2xl max-h-screen'
      classNames={{
        base: 'm-20',
        header: 'border-b-0 text-center',
        body: 'py-6',
        footer: 'justify-center space-x-3',
      }}
      isOpen={isOpen}
      placement='center'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex justify-center pb-0 text-2xl'>
              Đăng ký tài khoản
            </ModalHeader>

            <ModalBody className='space-y-3'>
              <Input
                isRequired
                label='Họ và tên'
                labelPlacement='outside'
                placeholder='Nhập họ và tên'
                startContent={
                  <Icon
                    className='text-2xl text-default-400'
                    icon='lucide:user'
                  />
                }
                value={form.full_name}
                variant='bordered'
                onChange={(e) => handleChange('full_name', e.target.value)}
              />

              <Input
                isRequired
                label='Email'
                labelPlacement='outside'
                placeholder='Nhập email của bạn'
                startContent={
                  <MailIcon className='text-2xl text-default-400' />
                }
                value={form.email}
                variant='bordered'
                onChange={(e) => handleChange('email', e.target.value)}
              />

              <Input
                isRequired
                label='Tên đăng nhập'
                labelPlacement='outside'
                placeholder='Nhập username'
                startContent={
                  <Icon
                    className='text-2xl text-default-400'
                    icon='lucide:user'
                  />
                }
                value={form.username}
                variant='bordered'
                onChange={(e) => handleChange('username', e.target.value)}
              />

              <Input
                isRequired
                label='Mật khẩu'
                labelPlacement='outside'
                placeholder='Nhập mật khẩu'
                startContent={
                  <LockIcon className='text-2xl text-default-400' />
                }
                type='password'
                value={form.password}
                variant='bordered'
                onChange={(e) => handleChange('password', e.target.value)}
              />

              <Select
                label='Vai trò'
                labelPlacement='outside'
                placeholder='Chọn vai trò'
                selectedKeys={[form.role]}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <SelectItem key='TEACHER'>Giáo viên</SelectItem>
                <SelectItem key='STUDENT'>Học sinh</SelectItem>
                <SelectItem key='ADMIN'>Quản trị viên</SelectItem>
              </Select>

              <Spacer y={2} />

              <p className='text-sm text-center'>
                Đã có tài khoản?{' '}
                <Link
                  color='primary'
                  href='#'
                  onPress={() => {
                    onClose();
                    navigate('/login');
                  }}
                >
                  Đăng nhập
                </Link>
              </p>
            </ModalBody>

            <ModalFooter>
              <form onSubmit={handleSubmit}>
                <Button
                  className='w-xl'
                  color='primary'
                  disabled={registerMutation.isPending}
                  type='submit'
                >
                  {registerMutation.isPending ? (
                    <CircularProgress label='Đang đăng ký...' />
                  ) : (
                    'Đăng ký'
                  )}
                </Button>
              </form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
