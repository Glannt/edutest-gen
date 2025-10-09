import React from 'react';
import { Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: 'lucide:layout-grid',
    title: 'Ma trận Đề Thi Tự động',
    description:
      'Tự động tạo đề thi theo ma trận kiến thức, mức độ nhận thức (nhận biết, thông hiểu, vận dụng) đã định sẵn.',
    benefit: 'Đảm bảo đề thi luôn chuẩn chương trình, kiểm tra đúng trọng tâm.',
    color: 'primary',
  },
  {
    icon: 'lucide:type',
    title: 'Công cụ Định dạng Chuyên nghiệp',
    description:
      'Tự động căn chỉnh, đánh số, xử lý công thức toán học/hóa học phức tạp, và tạo header/footer đồng bộ.',
    benefit: 'Đề thi luôn đẹp, chuyên nghiệp, và dễ dàng in ấn.',
    color: 'secondary',
  },
  {
    icon: 'lucide:mouse-pointer-click',
    title: 'Giao diện Kéo & Thả Trực quan',
    description:
      'Thao tác tạo/chỉnh sửa đề thi dễ dàng chỉ với vài click, không cần kiến thức kỹ thuật phức tạp.',
    benefit:
      'Tiết kiệm 80% thời gian biên soạn, trải nghiệm người dùng thân thiện, không cần đào tạo.',
    color: 'success',
  },
  {
    icon: 'lucide:database',
    title: 'Ngân hàng Đề thi Thông minh',
    description:
      'Quản lý Ngân hàng Câu hỏi với tag (chủ đề, độ khó, năm học), cho phép tìm kiếm và tái sử dụng dễ dàng.',
    benefit:
      'Xây dựng kho tài nguyên vĩnh cửu, tái tạo đề thi mới nhanh chóng.',
    color: 'warning',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Features: React.FC = () => {
  return (
    <section
      className='py-20 bg-content1'
      id='features'
    >
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Tính Năng Nổi Bật
          </h2>
          <p className='text-foreground-600 max-w-2xl mx-auto text-lg'>
            Công cụ tạo đề thi tiên tiến với các tính năng được thiết kế đặc
            biệt cho giáo viên và nhà quản lý giáo dục
          </p>
        </div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-8'
          initial='hidden'
          variants={container}
          viewport={{ once: true, amount: 0.2 }}
          whileInView='show'
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
            >
              <Card className='h-full border border-divider hover:shadow-md transition-shadow duration-300'>
                <CardBody className='p-6'>
                  <div
                    className={`w-12 h-12 rounded-full bg-${feature.color}-100 flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={`text-${feature.color} text-2xl`}
                      icon={feature.icon}
                    />
                  </div>
                  <h3 className='text-xl font-semibold mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-foreground-600 mb-4'>
                    {feature.description}
                  </p>
                  <Divider className='my-4' />
                  <div className='flex items-start gap-2 text-success'>
                    <Icon
                      className='mt-1'
                      icon='lucide:check'
                    />
                    <p className='text-foreground-700'>{feature.benefit}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className='mt-20'>
          <Card className='border border-divider overflow-hidden'>
            <CardBody className='p-0'>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='p-8 lg:p-12 flex flex-col justify-center'>
                  <h3 className='text-2xl font-bold mb-4'>
                    Trải nghiệm tạo đề thi hiện đại
                  </h3>
                  <p className='text-foreground-600 mb-6'>
                    Giao diện người dùng hiện đại, trực quan giúp giáo viên tạo
                    đề thi chuyên nghiệp mà không cần kiến thức kỹ thuật phức
                    tạp.
                  </p>
                  <ul className='space-y-3'>
                    {[
                      'Tạo đề thi chỉ với vài thao tác kéo thả',
                      'Tự động căn chỉnh định dạng theo chuẩn',
                      'Hỗ trợ công thức toán học, hóa học phức tạp',
                      'Xuất đề thi sang nhiều định dạng (PDF, Word, HTML)',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className='flex items-start gap-2'
                      >
                        <Icon
                          className='text-success mt-1'
                          icon='lucide:check-circle'
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='relative h-[400px] lg:h-auto'>
                  <img
                    alt='Test Creator Interface'
                    className='absolute inset-0 w-full h-full object-cover'
                    src='https://img.heroui.chat/image/dashboard?w=800&h=600&u=2'
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};
