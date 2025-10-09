import React from 'react';
import { Card, CardBody, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Trường học tin dùng' },
  { value: '10,000+', label: 'Giáo viên sử dụng' },
  { value: '1,000,000+', label: 'Đề thi đã tạo' },
  { value: '80%', label: 'Thời gian tiết kiệm' },
];

const testimonials = [
  {
    content:
      'Test Creator Pro đã giúp tôi tiết kiệm hàng giờ soạn đề thi mỗi tuần. Đề thi luôn đẹp, chuẩn xác và phù hợp với ma trận kiến thức. Đây là công cụ không thể thiếu cho mọi giáo viên hiện đại.',
    author: 'Nguyễn Thị Minh',
    role: 'Giáo viên Toán, THPT Chu Văn An',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
  },
  {
    content:
      'Với vai trò là Hiệu trưởng, tôi đánh giá cao tính nhất quán và chuyên nghiệp mà Test Creator Pro mang lại cho ngân hàng đề thi của trường. Giáo viên của chúng tôi đã tiết kiệm được rất nhiều thời gian và tạo ra các đề thi chất lượng cao hơn.',
    author: 'Trần Văn Hoàng',
    role: 'Hiệu trưởng, Trường THCS Nguyễn Du',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2',
  },
  {
    content:
      'Tôi đặc biệt ấn tượng với khả năng xử lý công thức toán học phức tạp của Test Creator Pro. Không còn phải vật lộn với việc định dạng công thức, tôi có thể tập trung vào nội dung chuyên môn của đề thi.',
    author: 'Lê Thị Hương',
    role: 'Giảng viên Vật lý, Đại học Khoa học Tự nhiên',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3',
  },
];

export const SocialProof: React.FC = () => {
  return (
    <section
      className='py-20 bg-background'
      id='testimonials'
    >
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Tại Sao Nên Tin Tưởng Chúng Tôi?
          </h2>
          <p className='text-foreground-600 max-w-2xl mx-auto text-lg'>
            Hàng ngàn giáo viên và trường học đã tin tưởng Test Creator Pro để
            tạo ra những đề thi chất lượng cao
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-20'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className='text-center'
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className='border border-divider h-full'>
                <CardBody className='p-6'>
                  <div className='text-3xl md:text-4xl font-bold text-primary mb-2'>
                    {stat.value}
                  </div>
                  <div className='text-foreground-600'>{stat.label}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className='border border-divider h-full'>
                <CardBody className='p-6'>
                  <div className='mb-6'>
                    <div className='flex gap-1 text-warning mb-4'>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          icon='lucide:star'
                        />
                      ))}
                    </div>
                    <p className='text-foreground-700 italic'>
                      `{testimonial.content}`
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Avatar
                      size='md'
                      src={testimonial.avatar}
                    />
                    <div>
                      <div className='font-medium'>{testimonial.author}</div>
                      <div className='text-small text-foreground-500'>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className='mt-20'>
          <Card className='border border-divider bg-gradient-to-r from-primary-100 to-primary-50'>
            <CardBody className='p-8 md:p-12'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                <div>
                  <h3 className='text-2xl font-bold mb-2'>
                    Được tin dùng bởi các tổ chức giáo dục hàng đầu
                  </h3>
                  <p className='text-foreground-600'>
                    Hơn 500 trường học và tổ chức giáo dục trên toàn quốc đã lựa
                    chọn Test Creator Pro
                  </p>
                </div>
                <div className='grid grid-cols-3 gap-6'>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className='bg-background rounded-lg p-4 flex items-center justify-center h-16 w-16 md:h-20 md:w-20'
                    >
                      <Icon
                        className='text-3xl'
                        icon={`logos:adobe-${i === 1 ? 'photoshop' : i === 2 ? 'illustrator' : 'xd'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};
