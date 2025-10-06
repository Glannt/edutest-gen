import QuestionTypeTable from '@/components/question-type/questiontype-table';

export default function QuestionType() {
  return (
    <>
      <div className='container mx-auto p-3'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý loại câu hỏi</h1>
        <QuestionTypeTable />
      </div>
    </>
  );
}
