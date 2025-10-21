import { Outlet } from 'react-router-dom';

export default function MatrixLayout() {
  return (
    <div className='container mx-auto p-3'>
      <h1 className='text-2xl font-bold mb-6'>Tạo ma trận đề</h1>

      {/* Nơi render các route con */}
      <Outlet />
    </div>
  );
}
