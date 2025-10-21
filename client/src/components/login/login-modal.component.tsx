import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Checkbox } from '@heroui/checkbox';
import { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { addToast, Spacer } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LockIcon,
  MailIcon,
} from '@/components/icons';
import { useLogin } from '@/hooks/useLogin';

interface LoginModalProps {
  children?: React.ReactNode;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  scrollBehavior?: 'normal' | 'inside' | 'outside';
  placement?: 'auto' | 'top' | 'center' | 'bottom';
  isOpen: boolean;
  defaultOpen?: boolean;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  shouldBlockScroll?: boolean;
  hideCloseButton?: boolean;
  closeButton?: React.ReactNode;
  motionProps?: any; // Thay bằng kiểu MotionProps nếu có import
  portalContainer?: HTMLElement;
  disableAnimation?: boolean;
  classNames?: any;

  onOpenChange?: (isOpen: boolean) => void;
}

export default function LoginModal(props: LoginModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleUsername = (e: any) => {
    setUsername(e);
  };
  const handlePassword = (e: any) => {
    setPassword(e);
  };
  const loginMutation = useLogin();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      addToast({
        title: 'Đăng nhập thành công',
        color: 'success',
        timeout: 2000,
      });
      try {
        const data = localStorage.getItem('auth-edutest-storage');

        if (!data) return;

        const parsed = JSON.parse(data);
        const user = parsed?.state?.user;

        if (user) {
          // Điều hướng theo role
          switch (user.role) {
            case 'ADMIN':
              navigate('/admin');
              break;
            case 'TEACHER':
              navigate('/dashboard');
              break;
            default:
              navigate('/');
          }
        }
      } catch (error) {
        addToast({
          title: 'Lỗi Đăng nhập ',
          color: 'warning',
          timeout: 2000,
        });
      }
    }
  }, [loginMutation.isSuccess, navigate]);

  return (
    <Modal
      backdrop='opaque'
      className='max-w-6xl w-2xl max-h-screen '
      classNames={{
        base: 'm-20',
        header: 'border-b-0 text-center',
        body: 'py-6',
        footer: 'justify-center space-x-3',
        closeButton: 'text-white/60 hover:text-white',
      }}
      isOpen={props.isOpen}
      placement='center'
      onOpenChange={props.onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex justify-center pb-0 text-2xl'>
              Đăng nhập
            </ModalHeader>
            <ModalBody className='space-y-1'>
              <Input
                isClearable
                isRequired
                classNames={{
                  base: 'w-full',
                  inputWrapper: 'p-5',
                  label: 'text-lg',
                }}
                label='Email or Username'
                labelPlacement='outside'
                placeholder='Nhập email hoặc username của bạn'
                size='lg'
                startContent={
                  <MailIcon className='text-2xl text-default-400 pointer-events-none shrink-0' />
                }
                variant='bordered'
                onChange={(e) => handleUsername(e.target.value)}
              />
              <Spacer y={4} />
              <Input
                isRequired
                classNames={{
                  inputWrapper: 'p-5',
                  label: 'text-lg',
                }}
                endContent={
                  <button
                    aria-label='toggle password visibility'
                    className='focus:outline-solid outline-transparent'
                    type='button'
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                    ) : (
                      <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                    )}
                  </button>
                }
                label='Mật khẩu'
                labelPlacement='outside'
                placeholder='Nhập mật khẩu của bạn'
                size='lg'
                startContent={
                  <LockIcon className='text-2xl text-default-400 pointer-events-none shrink-0' />
                }
                type={isVisible ? 'text' : 'password'}
                variant='bordered'
                onChange={(e) => {
                  handlePassword(e.target.value);
                }}
              />

              <div className='flex py-2 px-1 justify-between'>
                <Checkbox
                  classNames={{
                    label: 'text-small',
                  }}
                >
                  Remember me
                </Checkbox>
                <Link
                  color='primary'
                  href='#'
                  size='sm'
                >
                  Forgot password?
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <form onSubmit={handleSubmit}>
                <Button
                  className='w-xl'
                  color='primary'
                  disabled={loginMutation.isPending}
                  isLoading={loginMutation.isPending}
                  type='submit'
                >
                  Đăng nhập
                </Button>
              </form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
