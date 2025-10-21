import GradeTable from '@/components/grade/grade-table';

export default function GradePage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý khối lớp</h1>
        <GradeTable />
      </div>
    </>
  );
}
