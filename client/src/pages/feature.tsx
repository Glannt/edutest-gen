import React from 'react';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

import DefaultLayout from '@/layouts/default';
export default function FeaturePage() {
  return (
    <DefaultLayout>
      <div className='space-y-10'>
        <section className='text-center max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold light:text-gray-900 mb-4'>
            Tính năng AI Exam Creator
          </h1>
          <p className='text-lg light:text-gray-600'>
            Hệ thống trợ lý tạo đề thi thông minh giúp giáo viên tiết kiệm thời
            gian và tạo ra các bài kiểm tra chất lượng cao
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-bold light:text-gray-900 mb-6'>
            1. Các Tính năng Cốt lõi (Core Features)
          </h2>

          <div className='space-y-8'>
            <Card className='overflow-visible'>
              <CardHeader className='flex gap-3'>
                <div className='p-2 rounded-lg bg-blue-100'>
                  <Icon
                    className='text-blue-600 text-xl'
                    icon='lucide:database'
                  />
                </div>
                <div className='flex flex-col'>
                  <h3 className='text-xl font-semibold'>
                    A. Quản lý Kho Câu hỏi (Question Bank Management)
                  </h3>
                  <p className='light:text-gray-500'>
                    Nền tảng cho toàn bộ hệ thống
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Thêm/Sửa/Xóa Câu hỏi (CRUD)
                    </h4>
                    <p className='light:text-gray-600'>
                      Cho phép người dùng nhập thủ công các câu hỏi với giao
                      diện trực quan.
                    </p>
                  </div>

                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Trường Dữ liệu Bắt buộc
                    </h4>
                    <p className='light:text-gray-600 mb-2'>
                      Mỗi câu hỏi phải có các thuộc tính sau để phục vụ việc
                      sinh ma trận:
                    </p>

                    <ul className='list-disc pl-5 space-y-2 light:text-gray-600'>
                      <li>
                        Nội dung Câu hỏi và Đáp án (bao gồm cả giải thích)
                      </li>
                      <li>Môn học (Toán, Lý, Hóa, v.v.)</li>
                      <li>Khối/Lớp (10, 11, 12, v.v.)</li>
                      <li>Chương/Bài (để phân loại kiến thức)</li>
                      <li>
                        Độ Khó (Dễ, Trung bình, Khó - có thể dùng thang số 1-5)
                      </li>
                      <li>Loại Câu hỏi (Trắc nghiệm 1 đáp án, Tự luận)</li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className='overflow-visible'>
              <CardHeader className='flex gap-3'>
                <div className='p-2 rounded-lg bg-purple-100'>
                  <Icon
                    className='text-purple-600 text-xl'
                    icon='lucide:layout-grid'
                  />
                </div>
                <div className='flex flex-col'>
                  <h3 className='text-xl font-semibold'>
                    B. Công cụ Tạo Ma trận Đề thi (Blueprint Generator)
                  </h3>
                  <p className='light:text-gray-500'>
                    Tính năng trung tâm của dự án
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Input Thiết lập Đề
                    </h4>
                    <p className='light:text-gray-600 mb-2'>
                      Người dùng nhập các tham số tổng quát:
                    </p>

                    <ul className='list-disc pl-5 space-y-2 light:text-gray-600'>
                      <li>Tổng số câu hỏi (ví dụ: 50 câu)</li>
                      <li>
                        Tỷ lệ/Phân bổ theo các tiêu chí (ví dụ: 70% Trắc nghiệm,
                        30% Tự luận; 40% Dễ, 40% Trung bình, 20% Khó; Phân bổ
                        theo Chương/Bài cụ thể)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Tự động Sinh Ma trận
                    </h4>
                    <p className='light:text-gray-600'>
                      Hệ thống dựa trên Input và dữ liệu Kho Câu hỏi để tạo ra
                      Ma trận (bảng thống kê số lượng câu hỏi cần có theo từng
                      tiêu chí).
                    </p>
                  </div>

                  <div className='light:bg-yellow-50 dark:bg-yellow-700 p-3 rounded-md'>
                    <h4 className='font-medium light:text-yellow-800 dark:text-yellow-100'>
                      Mẹo cho AI
                    </h4>
                    <p className='light:text-yellow-700 dark:text-yellow-100'>
                      Trong giai đoạn đầu, thay vì dùng AI phức tạp, hệ thống sử
                      dụng thuật toán tham lam (greedy algorithm) đơn giản để
                      chọn ngẫu nhiên các câu hỏi thỏa mãn ma trận.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className='overflow-visible'>
              <CardHeader className='flex gap-3'>
                <div className='p-2 rounded-lg bg-green-100'>
                  <Icon
                    className='text-green-600 text-xl'
                    icon='lucide:file-text'
                  />
                </div>
                <div className='flex flex-col'>
                  <h3 className='text-xl font-semibold'>
                    C. Tạo Đề thi Hoàn chỉnh (Test Generation)
                  </h3>
                  <p className='light:text-gray-500'>
                    Tạo đề thi dựa trên ma trận đã thiết lập
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Sinh Đề thi
                    </h4>
                    <p className='light:text-gray-600'>
                      Dựa trên Ma trận đã tạo, hệ thống tự động chọn các câu hỏi
                      ngẫu nhiên từ Kho Câu hỏi để tạo thành một đề thi hoàn
                      chỉnh.
                    </p>
                  </div>

                  <div>
                    <h4 className='font-medium light:text-gray-900'>
                      Xuất Đề thi
                    </h4>
                    <p className='light:text-gray-600'>
                      Cho phép người dùng xem và xuất đề thi ra định dạng phổ
                      biến (ví dụ: Word/DOCX hoặc PDF đơn giản) với định dạng
                      sạch sẽ, dễ đọc.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold light:text-gray-900 mb-6'>
            2. Các Tính năng Mở rộng Tiềm năng (Bonus Features)
          </h2>

          <div className='grid md:grid-cols-3 gap-6'>
            <Card className='overflow-visible'>
              <CardBody>
                <div className='flex flex-col items-center text-center p-4'>
                  <div className='p-3 rounded-full bg-orange-100 mb-4'>
                    <Icon
                      className='text-orange-600 text-xl'
                      icon='lucide:copy'
                    />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Tạo Nhiều Mã Đề
                  </h3>
                  <p className='light:text-gray-600'>
                    Thay vì chỉ tạo 1 đề, tạo N mã đề hoán vị câu hỏi (chỉ cần
                    xáo trộn thứ tự câu hỏi và đáp án).
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className='overflow-visible'>
              <CardBody>
                <div className='flex flex-col items-center text-center p-4'>
                  <div className='p-3 rounded-full bg-teal-100 mb-4'>
                    <Icon
                      className='text-teal-600 text-xl'
                      icon='lucide:upload'
                    />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Import/Export Câu hỏi Hàng loạt
                  </h3>
                  <p className='light:text-gray-600'>
                    Cho phép người dùng tải lên file (ví dụ: Excel/CSV) chứa cấu
                    trúc câu hỏi, tiết kiệm thời gian nhập liệu.
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className='overflow-visible'>
              <CardBody>
                <div className='flex flex-col items-center text-center p-4'>
                  <div className='p-3 rounded-full bg-indigo-100 mb-4'>
                    <Icon
                      className='text-indigo-600 text-xl'
                      icon='lucide:layout'
                    />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Giao diện Web Cơ bản
                  </h3>
                  <p className='light:text-gray-600'>
                    Một giao diện đơn giản để tạo và quản lý đề thi thay vì chỉ
                    là công cụ dòng lệnh.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
