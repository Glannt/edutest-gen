import LevelTable from '@/components/level/level-table';

export default function LevelPage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý độ khó</h1>
        <LevelTable />
      </div>
    </>
  );
}
