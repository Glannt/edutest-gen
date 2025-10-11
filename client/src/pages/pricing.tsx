import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import DefaultLayout from '@/layouts/default';
export default function DocsPage() {
  return (
    <DefaultLayout>
      <div className='space-y-10'>
        <section className='text-center max-w-3xl mx-auto'>
          <h1 className='text-3xl font-bold light:text-gray-900 mb-4'>
            Bảng Giá & Gói Dịch Vụ
          </h1>
          <p className='text-lg light:text-gray-600'>
            Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </section>

        <section>
          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='overflow-visible border-2 border-gray-200'>
              <CardHeader className='flex flex-col items-center gap-3 pb-6'>
                <h2 className='text-2xl font-bold light:text-gray-900'>
                  Cơ Bản
                </h2>
                <div className='flex items-baseline'>
                  <span className='text-4xl font-bold light:text-gray-900'>
                    Miễn phí
                  </span>
                </div>
                <p className='light:text-gray-500 text-center'>
                  Dành cho giáo viên cá nhân
                </p>
              </CardHeader>
              <Divider />
              <CardBody className='space-y-4 py-6'>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Quản lý tối đa 100 câu hỏi
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Tạo tối đa 5 đề thi mỗi tháng
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Xuất đề thi dạng PDF
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>Hỗ trợ qua email</span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-gray-400 mt-1 flex-shrink-0'
                    icon='lucide:x'
                  />
                  <span className='light:text-gray-400'>Tạo nhiều mã đề</span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-gray-400 mt-1 flex-shrink-0'
                    icon='lucide:x'
                  />
                  <span className='text-gray-400'>
                    Import/Export câu hỏi hàng loạt
                  </span>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className='pt-6'>
                <Button
                  fullWidth
                  color='primary'
                  variant='bordered'
                >
                  Đăng ký ngay
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-visible border-2 border-blue-500 shadow-lg'>
              <div className='light:bg-blue-500 light:text-white text-center py-1 text-sm font-medium'>
                PHỔ BIẾN NHẤT
              </div>
              <CardHeader className='flex flex-col items-center gap-3 pb-6'>
                <h2 className='text-2xl font-bold light:text-gray-900'>
                  Tiêu Chuẩn
                </h2>
                <div className='flex items-baseline'>
                  <span className='text-4xl font-bold light:text-gray-900'>
                    199.000đ
                  </span>
                  <span className='light:text-gray-500 ml-1'>/tháng</span>
                </div>
                <p className='light:text-gray-500 text-center'>
                  Dành cho giáo viên chuyên nghiệp
                </p>
              </CardHeader>
              <Divider />
              <CardBody className='space-y-4 py-6'>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Quản lý không giới hạn câu hỏi
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Tạo không giới hạn đề thi
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Xuất đề thi dạng PDF và DOCX
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Tạo tối đa 4 mã đề
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Import/Export câu hỏi hàng loạt
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Hỗ trợ qua email và chat
                  </span>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className='pt-6'>
                <Button
                  fullWidth
                  color='primary'
                >
                  Đăng ký ngay
                </Button>
              </CardFooter>
            </Card>

            <Card className='overflow-visible border-2 border-gray-200'>
              <CardHeader className='flex flex-col items-center gap-3 pb-6'>
                <h2 className='text-2xl font-bold light:text-gray-900'>
                  Cao Cấp
                </h2>
                <div className='flex items-baseline'>
                  <span className='text-4xl font-bold light:text-gray-900'>
                    499.000đ
                  </span>
                  <span className='light:text-gray-500 ml-1'>/tháng</span>
                </div>
                <p className='light:text-gray-500 text-center'>
                  Dành cho trường học và tổ chức
                </p>
              </CardHeader>
              <Divider />
              <CardBody className='space-y-4 py-6'>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Tất cả tính năng của gói Tiêu Chuẩn
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Tạo không giới hạn mã đề
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Quản lý người dùng (tối đa 10 người)
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Chia sẻ kho câu hỏi trong tổ chức
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Phân tích thống kê đề thi
                  </span>
                </div>
                <div className='flex items-start gap-2'>
                  <Icon
                    className='text-green-500 mt-1 flex-shrink-0'
                    icon='lucide:check'
                  />
                  <span className='light:text-gray-700'>
                    Hỗ trợ ưu tiên 24/7
                  </span>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className='pt-6'>
                <Button
                  fullWidth
                  color='primary'
                  variant='bordered'
                >
                  Đăng ký ngay
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className='dark:bg-neutral-950 light:bg-gray-50 p-8 rounded-lg border border-gray-200'>
          <h2 className='text-2xl font-bold light:text-gray-900 mb-6'>
            Giấy phép Doanh nghiệp
          </h2>
          <p className='light:text-gray-600 mb-6'>
            Dành cho các tổ chức giáo dục lớn, sở giáo dục hoặc hệ thống trường
            học với nhu cầu đặc biệt.
          </p>

          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-blue-100'>
                <Icon
                  className='text-blue-600'
                  icon='lucide:users'
                />
              </div>
              <div>
                <h3 className='font-semibold light:text-gray-900'>
                  Không giới hạn người dùng
                </h3>
                <p className='light:text-gray-600'>
                  Mở rộng cho toàn bộ tổ chức của bạn
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-blue-100'>
                <Icon
                  className='text-blue-600'
                  icon='lucide:settings'
                />
              </div>
              <div>
                <h3 className='font-semibold light:text-gray-900'>
                  Tùy chỉnh theo yêu cầu
                </h3>
                <p className='light:text-gray-600'>
                  Điều chỉnh hệ thống theo nhu cầu cụ thể của tổ chức
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-blue-100'>
                <Icon
                  className='text-blue-600'
                  icon='lucide:shield'
                />
              </div>
              <div>
                <h3 className='font-semibold light:text-gray-900'>
                  Bảo mật nâng cao
                </h3>
                <p className='light:text-gray-600'>
                  Các tính năng bảo mật và quyền riêng tư bổ sung
                </p>
              </div>
            </div>
          </div>

          <Button
            className='mt-6'
            color='primary'
          >
            Liên hệ để nhận báo giá
          </Button>
        </section>

        <section>
          <h2 className='text-2xl font-bold light:text-gray-900 mb-6'>
            Câu hỏi thường gặp
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold light:text-gray-900'>
                Tôi có thể nâng cấp hoặc hạ cấp gói dịch vụ không?
              </h3>
              <p className='light:text-gray-600'>
                Có, bạn có thể thay đổi gói dịch vụ bất kỳ lúc nào. Việc nâng
                cấp sẽ có hiệu lực ngay lập tức, còn hạ cấp sẽ có hiệu lực vào
                đầu chu kỳ thanh toán tiếp theo.
              </p>
            </div>

            <div>
              <h3 className='font-semibold light:text-gray-900'>
                Có giảm giá cho các tổ chức giáo dục không?
              </h3>
              <p className='light:text-gray-600'>
                Có, chúng tôi cung cấp giảm giá đặc biệt cho các trường học và
                tổ chức giáo dục. Vui lòng liên hệ với bộ phận bán hàng để biết
                thêm chi tiết.
              </p>
            </div>

            <div>
              <h3 className='font-semibold light:text-gray-900'>
                Dữ liệu của tôi có được bảo mật không?
              </h3>
              <p className='light:text-gray-600'>
                Chúng tôi coi trọng bảo mật dữ liệu. Tất cả thông tin được mã
                hóa và lưu trữ an toàn theo các tiêu chuẩn bảo mật hiện đại.
              </p>
            </div>

            <div>
              <h3 className='font-semibold light:text-gray-900'>
                Tôi có thể hủy đăng ký bất kỳ lúc nào không?
              </h3>
              <p className='light:text-gray-600'>
                Có, bạn có thể hủy đăng ký bất kỳ lúc nào. Không có hợp đồng
                ràng buộc dài hạn.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
