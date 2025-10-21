import React, { SetStateAction, useState } from 'react';
import { Card, Button, Tabs, Tab, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';

import { TestStructure } from '@/components/matrix/test-structure';
import { useMatrixStore } from '@/store/matrix.store';
import { TestMatrixDynamic } from '@/components/matrix/test-matrix';
import { TestStructureCard } from '@/components/matrix/test-structure-card';
import { useCreateMatrix } from '@/hooks/useMatrix';
import { MatrixList } from '@/components/matrix/matrix.list';

export default function MatrixComponent() {
  const structures = useMatrixStore((s: any) => s.structures);
  const removeStructure = useMatrixStore((s: any) => s.removeStructure);
  const [showMatrix, setShowMatrix] = useState(false);
  const { buildMatrixRequest, clearStructures } = useMatrixStore();
  const createMatrix = useCreateMatrix();
  const [tabSelected, setTabSelected] =
    useState<SetStateAction<string>>('matrix-create');

  const handleSave = async () => {
    try {
      const payload = buildMatrixRequest();

      await createMatrix.mutateAsync(payload);

      addToast({
        title: 'Lưu ma trận thành công!',
        color: 'success',
        timeout: 2000,
      });
      clearStructures();
      setShowMatrix(false);
    } catch (error: any) {
      addToast({
        title: 'Lưu ma trận thất bại',
        description: error.message,
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleGenerateMatrix = () => {
    if (structures.length === 0) {
      alert('Chưa có cấu trúc nào để tạo ma trận!');

      return;
    }
    setShowMatrix(true);
  };

  return (
    <div className='max-w-full mx-auto p-4 min-h-screen space-y-4'>
      <Tabs
        aria-label='Ma trận'
        className='w-full'
        classNames={{
          tabList:
            'gap-4 w-full relative rounded-none p-0 border-b border-divider px-6',
          tabContent: 'text-base font-medium',
          cursor: 'bg-primary',
        }}
        color='primary'
        selectedKey={tabSelected?.toString() ?? ''}
        variant='underlined'
        onSelectionChange={(key) => setTabSelected(String(key))}
      >
        {/* Tabs header */}
        <Tab
          key='matrix-create'
          title='Tạo ma trận'
        >
          <div className='max-w-full mx-auto p-4 gap-4 grid grid-cols-1 md:grid-cols-2'>
            {/* === Cột 1: Cards cấu trúc === */}
            <div className='space-y-4'>
              <Card className='shadow-sm'>
                <TestStructure />
              </Card>

              {/* <Card className='shadow-sm'>
                <TestInformation />
              </Card> */}

              {/* <Card className='shadow-sm'>
                <KnowledgeSources />
              </Card>

              <Card className='shadow-sm'>
                <QuestionBank />
              </Card>

              <Card className='shadow-sm'>
                <DataManagement />
              </Card> */}

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
                  <TestStructureCard />
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
                <span className='font-medium text-lg'>Xem Ma trận đề thi</span>
              </div>

              <div className='p-6 min-h-[200px]'>
                <TestMatrixDynamic />
              </div>

              <div className='border-t p-4'>
                <Button
                  className='w-full font-medium'
                  color='primary'
                  onPress={handleSave}
                >
                  Lưu ma trận đề thi
                </Button>
              </div>
            </Card>
          )}
        </Tab>
        <Tab
          key={'matrix-list'}
          title={`Tất cả ma trận`}
        >
          <MatrixList />
        </Tab>
      </Tabs>
    </div>
  );
}
