import { Outlet } from 'react-router-dom';

export default function LessonPage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Câu hỏi</h1>
        <Outlet />
      </div>
    </>
  );
}
