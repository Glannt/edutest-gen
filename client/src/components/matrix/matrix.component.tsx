import React, { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { TestStructure } from '@/components/matrix/test-structure';
import { TestInformation } from '@/components/matrix/test-information';
import { KnowledgeSources } from '@/components/matrix/knowledge-sources';
import { QuestionBank } from '@/components/matrix/question-bank';
import { DataManagement } from '@/components/matrix/data-management';
import { useMatrixStore } from '@/store/matrix.store';
import { TestMatrix } from '@/components/matrix/test-matrix';

export default function MatrixComponent() {
  const structures = useMatrixStore((s: any) => s.structures);
  const removeStructure = useMatrixStore((s: any) => s.removeStructure);
  const [showMatrix, setShowMatrix] = useState(false);

  const handleGenerateMatrix = () => {
    if (structures.length === 0) {
      alert('Chưa có cấu trúc nào để tạo ma trận!');

      return;
    }
    setShowMatrix(true);
  };

  const handleSaveMatrix = () => {
    alert('✅ Ma trận đã được lưu!');
  };

  return (
    <div className='max-w-full mx-auto p-4 min-h-screen space-y-4'>
      <div className='max-w-full mx-auto p-4 gap-4 grid grid-cols-1 md:grid-cols-2'>
        {/* === Cột 1: Cards cấu trúc === */}
        <div className='space-y-4'>
          <Card className='shadow-sm'>
            <TestStructure />
          </Card>

          <Card className='shadow-sm'>
            <TestInformation />
          </Card>

          <Card className='shadow-sm'>
            <KnowledgeSources />
          </Card>

          <Card className='shadow-sm'>
            <QuestionBank />
          </Card>

          <Card className='shadow-sm'>
            <DataManagement />
          </Card>

          <Button
            className='w-full py-3 font-medium'
            color='success'
            onPress={handleGenerateMatrix}
          >
            Tạo đề thi, Ma trận & Đặc tả
          </Button>
        </div>

        {/* === Cột 2: Danh sách cấu trúc đã thêm === */}
        <div className='space-y-4'>
          <Card className='shadow-sm'>
            <div className='p-4 flex items-center gap-2 border-b'>
              <Icon
                className='text-xl'
                icon='lucide:list'
              />
              <span className='font-medium text-lg'>Cấu trúc đã thêm</span>
            </div>

            <div className='p-4'>
              {structures.length > 0 ? (
                <div className='space-y-2'>
                  {structures.map((item: any) => (
                    <Card
                      key={item.id}
                      className='p-3 flex justify-between items-center border shadow-none hover:bg-content2 transition relative group'
                    >
                      <div>
                        <p className='font-medium'>
                          {item.subject} - {item.grade}
                        </p>
                        <p>
                          {item.chapter} / {item.lesson}
                        </p>
                        <p>
                          {item.level} - {item.questionType} (
                          {item.questionCount} câu)
                        </p>
                      </div>

                      <div
                        className='absolute right-0 top-0 h-full w-1/4 flex items-center justify-center bg-danger/10 text-danger opacity-0 group-hover:opacity-100 transition rounded-r'
                        role='button'
                        tabIndex={0}
                        onClick={() => removeStructure(item.id)}
                      >
                        <Icon
                          className='text-lg'
                          icon='lucide:trash-2'
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-6'>
                  Chưa có cấu trúc nào được thêm.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* === Ma trận đề thi === */}
      {showMatrix && (
        <Card className='shadow-sm'>
          <div className='p-4 flex items-center gap-2 border-b'>
            <Icon
              className='text-xl'
              icon='lucide:grid'
            />
            <span className='font-medium text-lg'>
              Xem trước Ma trận đề thi
            </span>
          </div>

          <div className='p-6 min-h-[200px]'>
            <TestMatrix />
          </div>

          <div className='border-t p-4'>
            <Button
              className='w-full font-medium'
              color='primary'
              onPress={handleSaveMatrix}
            >
              💾 Lưu ma trận đề thi
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
