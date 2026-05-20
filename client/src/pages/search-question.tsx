import { QuestionBank } from '@/components/matrix/question-bank';

export const QuestionSearchPage = () => {
  return (
    <>
      <div className='container mx-auto p-3'>
        <h1 className='text-2xl font-bold mb-6'>Tìm câu hỏi bằng AI</h1>
        <QuestionBank />
      </div>
    </>
  );
};
