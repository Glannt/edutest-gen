import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className='relative overflow-hidden bg-background py-20 lg:py-28'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute -top-[40%] -right-[30%] h-[800px] w-[800px] rounded-full bg-primary/5' />
        <div className='absolute -bottom-[20%] -left-[30%] h-[600px] w-[600px] rounded-full bg-primary/5' />
      </div>

      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-center text-center'>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Tạo Đề Thi Chuẩn Chỉ Trong Vài Phút
            </h1>
            <p className='text-xl md:text-2xl text-foreground-600 mb-8 max-w-2xl mx-auto'>
              Giải pháp toàn diện giúp giáo viên tạo đề thi{' '}
              <span className='font-semibold text-primary'>chuẩn xác</span>,{' '}
              <span className='font-semibold text-primary'>thẩm mỹ</span> và{' '}
              <span className='font-semibold text-primary'>
                tiết kiệm thời gian
              </span>{' '}
              tới 80%.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
              <Button
                className='font-medium text-medium px-8'
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
                startContent={<Icon icon='lucide:play' />}
                variant='bordered'
              >
                Xem Video Giới Thiệu
              </Button>
            </div>

            <div className='mt-10 flex items-center justify-center gap-6 text-small text-foreground-500'>
              <div className='flex items-center'>
                <Icon
                  className='text-success mr-2'
                  icon='lucide:check-circle'
                />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className='flex items-center'>
                <Icon
                  className='text-success mr-2'
                  icon='lucide:check-circle'
                />
                <span>Dùng thử 14 ngày</span>
              </div>
              <div className='flex items-center'>
                <Icon
                  className='text-success mr-2'
                  icon='lucide:check-circle'
                />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='mt-16 w-full max-w-5xl mx-auto'
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className='relative rounded-xl overflow-hidden shadow-2xl border border-divider'>
              <img
                alt='Test Creator Pro Dashboard'
                className='w-full h-auto object-cover'
                src='https://img.heroui.chat/image/dashboard?w=1200&h=600&u=1'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end'>
                <div className='p-6'>
                  <div className='inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full py-2 px-4 text-small font-medium border border-divider'>
                    <Icon
                      className='text-primary'
                      icon='lucide:sparkles'
                    />
                    <span>
                      Giao diện trực quan, dễ sử dụng cho mọi giáo viên
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
