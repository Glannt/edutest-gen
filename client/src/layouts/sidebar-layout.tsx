import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/drawer';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ThemeSwitch } from '@/components/theme-switch';
import { useAuthStore } from '@/store/auth.store';
import { siteConfig } from '@/config/site';

// Define navigation items
// const navItems = [
//   { name: 'Dashboard', path: '/dashboard', icon: 'lucide:layout-dashboard' },
//   { name: 'Độ khó', path: '/dashboard/level', icon: 'lucide:user' },
//   { name: 'Môn học', path: '/dashboard/subject', icon: 'lucide:user' },
//   {
//     name: 'Loại câu hỏi',
//     path: '/dashboard/question-type',
//     icon: 'lucide:user',
//   },
//   { name: 'Lớp', path: '/grade', icon: 'lucide:user' },
//   { name: 'Bài học', path: '/lesson', icon: 'lucide:user' },
//   { name: 'Ma trận', path: '/dashboard/matrix', icon: 'lucide:user' },
//   { name: 'Bài học', path: '/dashboard/lesson', icon: 'lucide:user' },
//   { name: 'Nội dung', path: '/dashboard/content', icon: 'lucide:user' },
//   { name: 'Câu hỏi', path: '/question', icon: 'lucide:user' },
//   { name: 'Bài thi', path: '/exam', icon: 'lucide:user' },
//   { name: 'Settings', path: '/settings', icon: 'lucide:settings' },
//   { name: 'Analytics', path: '/analytics', icon: 'lucide:bar-chart' },
// ];

export default function SidebarLayout() {
  const location = useLocation();
  const [isHover, setIsHover] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  // ✅ Lấy thông tin user từ Zustand
  const user = useAuthStore((state) => state.user);

  type Role = keyof typeof siteConfig.NAV_CONFIG;
  const role = (user?.role as Role) ?? 'TEACHER';

  // ✅ Lấy danh sách nav theo role
  const navItems = siteConfig.NAV_CONFIG[role];

  // Handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);
      setIsOpen(!mobile); // Auto-close on mobile, auto-open on desktop
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsHover(!isHover);
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-edutest-storage');
    window.location.href = '/';
  };

  return (
    <div className='min-h-screen'>
      {/* Toggle button for mobile */}
      {/* {isMobile && (
        <Button
          isIconOnly
          aria-label='Toggle Sidebar'
          className='fixed top-4 left-4 z-50'
          variant='light'
          onPress={toggleSidebar}
        >
          <PlusIcon className='text-xl' />
        </Button>
      )} */}
      {!isOpen && (
        <aside
          className='fixed top-0 left-0 h-full z-50 flex items-center'
          onMouseEnter={toggleSidebar}
        >
          <div className='h-full w-9 bg-content1 shadow-md rounded-r-sm border-r border-divider m-2 cursor-pointer hover:w-6 transition-all duration-200' />
        </aside>
      )}
      {/* Sidebar using Drawer */}
      <Drawer
        hideCloseButton
        // Make it non-dismissible on desktop
        onMouseLeave={toggleSidebar}
        placement='left'
        // Use backdrop only on mobile
        backdrop={isMobile ? 'opaque' : 'transparent'}
        onOpenChange={toggleSidebar}
        // isDismissable={isMobile}
        isOpen={isOpen}
      >
        <DrawerContent
          className={
            isMobile ? '' : 'shadow-none max-w-[280px] border-r border-divider'
          }
        >
          {(onClose) => (
            <>
              <DrawerHeader className='flex items-center px-4 py-5 border-b border-divider'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-md bg-primary flex items-center justify-center'>
                    {/* <Icon
                      className='text-white text-lg'
                      icon='lucide:layout'
                    /> */}
                  </div>
                  <span className='font-semibold text-lg'>
                    Trợ lý tạo đề thi AI
                  </span>
                </div>
              </DrawerHeader>
              <DrawerBody className='p-0'>
                <nav className='flex flex-col py-4'>
                  {navItems.map((item: any) => (
                    <NavLink
                      key={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary border-r-4 border-primary'
                            : 'text-foreground-600 hover:bg-content2'
                        }`
                      }
                      end={item.path === '/dashboard'}
                      to={item.path}
                      onClick={isMobile ? onClose : undefined}
                    >
                      {/* <Icon
                        className='text-xl'
                        icon={item.icon}
                      /> */}
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </DrawerBody>
              <DrawerFooter className='h-24'>
                <div className='w-full border-t border-divider py-3 flex justify-around'>
                  <ThemeSwitch />
                  <Badge
                    color='danger'
                    content=''
                    placement='top-right'
                    shape='circle'
                  >
                    <Button
                      isIconOnly
                      variant='light'
                    >
                      <Icon
                        className='text-xl'
                        icon='lucide:bell'
                      />
                    </Button>
                  </Badge>

                  <UserDropdown onLogout={handleLogout} />
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      {/* Main content */}
      <main
        className={`transition-all duration-300 ${!isMobile && isOpen ? 'ml-[280px]' : 'ml-0'}`}
      >
        <div className='p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function UserDropdown({ onLogout }: any) {
  const [fullName, setFullName] = useState<string>('Người dùng');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth-edutest-storage');

      if (stored) {
        const parsed = JSON.parse(stored);
        const user = parsed?.state?.user;

        if (user?.full_name) setFullName(user.full_name);
      }
    } catch (err) {
      console.error('Lỗi khi đọc thông tin người dùng:', err);
    }
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isFocusable
          name={fullName}
          size='sm'
          src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${encodeURIComponent(fullName)}`}
        />
      </DropdownTrigger>

      <DropdownMenu aria-label='User menu'>
        <DropdownItem
          key='name'
          isReadOnly
        >
          <span style={{ fontWeight: 'bold' }}>{fullName}</span>
        </DropdownItem>

        <DropdownItem
          key='logout'
          color='danger'
          onAction={onLogout}
        >
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
