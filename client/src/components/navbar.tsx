import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';
import { useDisclosure } from '@heroui/modal';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { GithubIcon, SearchIcon } from '@/components/icons';
import { Logo } from '@/components/icons';
import LoginModal from '@/components/login/login-modal.component';

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const searchInput = (
    <Input
      aria-label='Search'
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd
          className='hidden lg:inline-block'
          keys={['command']}
        >
          K
        </Kbd>
      }
      labelPlacement='outside'
      placeholder='Search...'
      startContent={
        <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
      }
      type='search'
    />
  );

  return (
    <HeroUINavbar
      height='5rem'
      maxWidth='xl'
      position='sticky'
    >
      <NavbarContent
        className='basis-1/5 sm:basis-full'
        justify='start'
      >
        <NavbarBrand className='gap-3 max-w-fit'>
          <Link
            className='flex justify-start items-center gap-1'
            color='foreground'
            href='/'
          >
            <Logo />
            <p className='font-bold text-inherit'>Trợ lý tạo đề thi</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden md:flex'>
          <Button
            isExternal
            as={Link}
            className='text-lg font-normal text-default-600 bg-default-100 p-5 hover:scale-110 hover:duration-800 hover:transition-animate'
            // href={
            //   siteConfig.navMenuItems.find((item) => item.label === 'Login')
            //     ?.href
            // }
            variant='ghost'
            onPress={onOpen}
          >
            Đăng nhập
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className='sm:hidden basis-1 pl-4'
        justify='end'
      >
        <Link
          isExternal
          href={siteConfig.links.github}
        >
          <GithubIcon className='text-default-500' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href='#'
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
      {isOpen && (
        <LoginModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          {/* ...existing code... */}
        </LoginModal>
      )}
    </HeroUINavbar>
  );
};
