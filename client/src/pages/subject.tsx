import SubjectTable from '@/components/subject/subject-table';

export default function SubjectPage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý môn học</h1>
        <SubjectTable />
      </div>
    </>
  );
}
