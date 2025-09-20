import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@heroui/drawer';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@heroui/button';

import { ChevronRightIcon } from '@/components/icons';

// Define navigation items
const navItems = [
  { name: 'Dashboard', path: '/', icon: 'lucide:layout-dashboard' },
  { name: 'Độ khó', path: '/level', icon: 'lucide:user' },
  { name: 'Môn học', path: '/dashboard/subject', icon: 'lucide:user' },
  { name: 'Loại câu hỏi', path: '/question-type', icon: 'lucide:user' },
  { name: 'Lớp', path: '/grade', icon: 'lucide:user' },
  { name: 'Bài học', path: '/lesson', icon: 'lucide:user' },
  { name: 'Ma trận', path: '/matrix', icon: 'lucide:user' },
  { name: 'Câu hỏi', path: '/question', icon: 'lucide:user' },
  { name: 'Bài thi', path: '/exam', icon: 'lucide:user' },
  { name: 'Settings', path: '/settings', icon: 'lucide:settings' },
  { name: 'Analytics', path: '/analytics', icon: 'lucide:bar-chart' },
];

export default function SidebarLayout() {
  const location = useLocation();
  const [isHover, setIsHover] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

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
        <Button
          isIconOnly
          aria-label='Toggle Sidebar'
          className='fixed top-4 left-4 z-50'
          variant='light'
          onMouseEnter={toggleSidebar}

          // onPress={toggleSidebar}
        >
          <ChevronRightIcon className='text-xl' />
        </Button>
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
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary border-r-4 border-primary'
                            : 'text-foreground-600 hover:bg-content2'
                        }`
                      }
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
