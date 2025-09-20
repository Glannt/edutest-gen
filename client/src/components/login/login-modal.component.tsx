import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Checkbox } from '@heroui/checkbox';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';

import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LockIcon,
  MailIcon,
} from '@/components/icons';

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
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal
      backdrop='opaque'
      className='max-w-6xl w-2xl max-h-screen h-96'
      classNames={{
        base: 'm-20',
      }}
      isOpen={props.isOpen}
      placement='top-center'
      onOpenChange={props.onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 text-2xl'>
              Đăng nhập
            </ModalHeader>
            <ModalBody className='mt-3 mb-auto'>
              <Input
                isClearable
                isRequired
                classNames={{
                  inputWrapper: 'p-5',
                  label: 'text-lg',
                }}
                label='Email'
                labelPlacement='outside'
                placeholder='Nhập email của bạn'
                size='lg'
                startContent={
                  <MailIcon className='text-2xl text-default-400 pointer-events-none shrink-0' />
                }
                variant='bordered'
              />
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
              <Button
                color='danger'
                variant='flat'
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                color='primary'
                onPress={onClose}
              >
                Đăng nhập
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
