import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export const Closing: React.FC = () => {
  return (
    <section className='py-20 bg-gradient-to-b from-content1 to-background'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='max-w-4xl mx-auto text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Sẵn sàng nâng cao chất lượng đề thi của bạn?
          </h2>
          <p className='text-xl text-foreground-600 mb-10 max-w-2xl mx-auto'>
            Tiết kiệm thời gian, tạo đề thi chuẩn xác và chuyên nghiệp chỉ trong
            vài phút với Test Creator Pro.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            {[
              {
                icon: 'lucide:clock',
                title: 'Tiết kiệm thời gian',
                description:
                  'Giảm 80% thời gian soạn đề thi so với phương pháp truyền thống',
              },
              {
                icon: 'lucide:check-circle',
                title: 'Chuẩn xác',
                description:
                  'Đảm bảo đề thi tuân thủ ma trận kiến thức và chuẩn chương trình',
              },
              {
                icon: 'lucide:layout',
                title: 'Chuyên nghiệp',
                description: 'Định dạng đẹp mắt, thẩm mỹ và dễ dàng in ấn',
              },
            ].map((item, index) => (
              <Card
                key={index}
                className='border border-divider'
              >
                <CardBody className='p-6 text-center'>
                  <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4'>
                    <Icon
                      className='text-primary text-xl'
                      icon={item.icon}
                    />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>{item.title}</h3>
                  <p className='text-foreground-600 text-small'>
                    {item.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className='border border-divider bg-content1 shadow-lg'>
            <CardBody className='p-8 md:p-12'>
              <h3 className='text-2xl font-bold mb-4'>Bắt đầu ngay hôm nay</h3>
              <p className='text-foreground-600 mb-8'>
                Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng. Khám phá sức
                mạnh của Test Creator Pro.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  className='font-medium px-8'
                  color='primary'
                  endContent={<Icon icon='lucide:arrow-right' />}
                  size='lg'
                >
                  Dùng Thử Miễn Phí Ngay
                </Button>
                <Button
                  className='font-medium'
                  color='primary'
                  size='lg'
                  startContent={<Icon icon='lucide:calendar' />}
                  variant='bordered'
                >
                  Đặt Lịch Demo
                </Button>
              </div>

              <div className='mt-6 text-small text-foreground-500'>
                Đã có tài khoản?{' '}
                <a
                  className='text-primary font-medium'
                  href='/'
                >
                  Đăng nhập
                </a>
              </div>
            </CardBody>
          </Card>

          <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card className='border border-divider'>
              <CardBody className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='text-primary'>
                    <Icon
                      className='text-2xl'
                      icon='lucide:video'
                    />
                  </div>
                  <div className='text-left'>
                    <h3 className='text-lg font-semibold mb-2'>
                      Xem Video Hướng Dẫn
                    </h3>
                    <p className='text-foreground-600 mb-4'>
                      Tìm hiểu cách sử dụng Test Creator Pro qua các video hướng
                      dẫn chi tiết.
                    </p>
                    <Button
                      color='primary'
                      endContent={<Icon icon='lucide:arrow-right' />}
                      variant='light'
                    >
                      Xem ngay
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className='border border-divider'>
              <CardBody className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='text-primary'>
                    <Icon
                      className='text-2xl'
                      icon='lucide:headphones'
                    />
                  </div>
                  <div className='text-left'>
                    <h3 className='text-lg font-semibold mb-2'>
                      Liên Hệ Hỗ Trợ
                    </h3>
                    <p className='text-foreground-600 mb-4'>
                      Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
                      24/7.
                    </p>
                    <Button
                      color='primary'
                      endContent={<Icon icon='lucide:arrow-right' />}
                      variant='light'
                    >
                      Liên hệ ngay
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
