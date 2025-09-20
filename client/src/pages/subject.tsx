import SubjectTable from '@/components/dashboard/subject-table';

export default function SubjectPage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Subject Management</h1>
        <SubjectTable />
      </div>
    </>
  );
}
