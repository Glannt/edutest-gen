import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const actions = [
    { title: 'Tạo bài thi', color: 'primary', path: '/dashboard/exam' },
    { title: 'Tạo ma trận', color: 'secondary', path: '/dashboard/matrix' },
    { title: 'Tạo bài học', color: 'success', path: '/dashboard/lesson' },
  ];

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>Chào mừng bạn đến với bảng điều khiển. Hãy chọn thao tác bên dưới.</p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {actions.map((item, index) => (
          <Button
            key={index}
            className='p-10 h-40 text-lg font-semibold rounded-xl shadow-md hover:scale-[1.03] transition-transform border border-divider w-full flex items-center justify-center text-center'
            color={item.color as any}
            variant='flat'
            onPress={() => navigate(item.path)}
          >
            {item.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
