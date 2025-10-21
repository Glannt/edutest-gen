import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';

import { AutoGenerateExamForm } from '@/components/exam/auto-generate-exam-form';
import { ExamList } from '@/components/exam/exam-list';
import CreateExamPage from '@/components/test/create-exam.page';

export default function ExamPage() {
  const [selectedTab, setSelectedTab] = useState<string>('create');
  const handleSelectTab = (e: any) => {
    setSelectedTab(e);
  };

  return (
    <>
      <div className='container mx-auto p-3'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý đề thi</h1>

        <Tabs
          aria-label='Exam Management Options'
          className='mb-6'
          selectedKey={selectedTab}
          onSelectionChange={(e) => handleSelectTab(e)}
        >
          <Tab
            key='create'
            title='Tạo đề thi'
          >
            <Card>
              <CardBody>
                {/* <CreateExamForm /> */}
                <CreateExamPage />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key='auto-generate'
            title='Tự động tạo đề thi'
          >
            <Card>
              <CardBody>
                <AutoGenerateExamForm />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key='all-exams'
            title='Danh sách đề thi'
          >
            <Card>
              <CardBody>
                <ExamList />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
