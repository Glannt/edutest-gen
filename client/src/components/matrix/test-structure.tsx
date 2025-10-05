import React from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useMatrixStore } from '@/store/matrix.store';
import {
  chapters,
  grades,
  lessons,
  levels,
  questionTypes,
  subjects,
} from '@/data/test-structure.data';

export const TestStructure: React.FC = () => {
  const addStructure = useMatrixStore((s: any) => s.addStructure);

  const [form, setForm] = React.useState({
    subject: '',
    grade: '',
    chapter: '',
    lesson: '',
    questionCount: 0,
    level: '',
    questionType: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    addStructure(form);
    setForm({
      subject: '',
      grade: '',
      chapter: '',
      lesson: '',
      questionCount: 0,
      level: '',
      questionType: '',
    });
  };

  const addToMatrix = () => {
    if (!form.subject || !form.grade || !form.chapter || !form.lesson) {
      alert('Vui lòng chọn đầy đủ thông tin!');

      return;
    }

    addStructure({
      subject: form.subject,
      grade: form.grade,
      chapter: form.chapter,
      lesson: form.lesson,
      level: form.level,
      questionType: form.questionType,
      questionCount: Number(form.questionCount),
    });

    // reset form
    setForm({
      subject: '',
      grade: '',
      chapter: '',
      lesson: '',
      level: '',
      questionType: '',
      questionCount: 1,
    });
  };

  return (
    <div>
      <div className='flex items-center gap-2 p-4 border-b'>
        <Icon
          className='text-amber-600'
          icon='lucide:edit'
        />
        <span className='font-medium text-lg'>1. Xây dựng cấu trúc</span>
      </div>

      <div className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <Select
            label='Môn học'
            placeholder='-- Chọn môn học --'
            selectedKeys={[form.subject]}
            onChange={(e) => handleChange('subject', e.target.value)}
          >
            {subjects.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>

          <Select
            label='Lớp học'
            placeholder='-- Chọn lớp học --'
            selectedKeys={[form.grade]}
            onChange={(e) => handleChange('grade', e.target.value)}
          >
            {grades.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Select
          className='mb-4'
          label='Chương'
          placeholder='-- Chọn chương --'
          selectedKeys={[form.chapter]}
          onChange={(e) => handleChange('chapter', e.target.value)}
        >
          {chapters.map((s) => (
            <SelectItem key={s.key}>{s.label}</SelectItem>
          ))}
        </Select>

        <Select
          className='mb-4'
          label='Bài học'
          placeholder='-- Chọn bài học --'
          selectedKeys={[form.lesson]}
          onChange={(e) => handleChange('lesson', e.target.value)}
        >
          {lessons.map((s) => (
            <SelectItem key={s.key}>{s.label}</SelectItem>
          ))}
        </Select>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <Input
            label='Số câu hỏi'
            type='number'
            value={form.questionCount.toString()}
            onChange={(e) =>
              handleChange('questionCount', Number(e.target.value))
            }
          />

          <Select
            label='Mức độ'
            placeholder='-- Chọn cấp độ --'
            selectedKeys={[form.level]}
            onChange={(e) => handleChange('level', e.target.value)}
          >
            {levels.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Select
          className='mb-4'
          label='Chọn loại câu hỏi'
          placeholder='-- Chọn loại câu hỏi --'
          selectedKeys={[form.questionType]}
          onChange={(e) => handleChange('questionType', e.target.value)}
        >
          {questionTypes.map((s) => (
            <SelectItem key={s.key}>{s.label}</SelectItem>
          ))}
        </Select>

        <Button
          className='w-full'
          color='primary'
          startContent={<Icon icon='lucide:plus' />}
          onPress={handleAdd}
        >
          Thêm vào cấu trúc
        </Button>
      </div>
    </div>
  );
};
