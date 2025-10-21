export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Vite + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Docs',
      href: '/docs',
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Team',
      href: '/team',
    },
    {
      label: 'Calendar',
      href: '/calendar',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
    },
    {
      label: 'Logout',
      href: '/logout',
    },
    {
      label: 'Login',
      href: '/login',
    },
  ],
  links: {
    github: 'https://github.com/frontio-ai/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
  routes: {
    login: '/login',
    logout: '/logout',
    dashboard: '/dashboard',
  },
  NAV_CONFIG: {
    ADMIN: [
      {
        name: 'Dashboard',
        path: '/admin',
        icon: 'lucide:layout-dashboard',
      },
      { name: 'Tài khoản', path: '/admin/user', icon: 'lucide:user' },
      { name: 'Khối lớp', path: '/admin/grade', icon: 'lucide:graduation-cap' },
      { name: 'Môn học', path: '/admin/subject', icon: 'lucide:book' },
      { name: 'Độ khó', path: '/admin/level', icon: 'lucide:activity' },
      {
        name: 'Loại câu hỏi',
        path: '/admin/question-type',
        icon: 'lucide:list',
      },
      // { name: 'Ma trận', path: '/dashboard/matrix', icon: 'lucide:grid' },
      // { name: 'Bài học', path: '/dashboard/lesson', icon: 'lucide:book-open' },

      // {
      //   name: 'Nội dung',
      //   path: '/dashboard/content',
      //   icon: 'lucide:file-text',
      // },
      { name: 'Cài đặt', path: '/admin/settings', icon: 'lucide:settings' },
    ],
    TEACHER: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'lucide:layout-dashboard',
      },
      { name: 'Ma trận', path: '/dashboard/matrix', icon: 'lucide:grid' },
      { name: 'Bài thi', path: '/dashboard/exam', icon: 'lucide:book-close' },
      {
        name: 'Nội dung',
        path: '/dashboard/content',
        icon: 'lucide:file-text',
      },
      { name: 'Bài học', path: '/dashboard/lesson', icon: 'lucide:book-open' },
      { name: 'Cài đặt', path: '/dashboard/settings', icon: 'lucide:settings' },
    ],
  },
};
