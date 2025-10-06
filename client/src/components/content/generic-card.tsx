import { Icon } from '@iconify/react';
import { Card, CardBody } from '@heroui/react';

/**
 * Interface chung cho các payload có cấu trúc cơ bản (id, name, description, created_at, updated_at)
 */
export interface BasePayload {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props generic cho component card
 * @type T - Bất kỳ kiểu nào kế thừa từ BasePayload
 */
interface GenericCardProps<T extends BasePayload> {
  item: T;
  type?: 'subject' | 'level' | 'question-type' | 'default';
  onClick?: (item: T) => void; // thêm prop onClick
  className?: string;
}

/**
 * Component GenericCard — có thể tái sử dụng cho nhiều loại dữ liệu khác nhau.
 */
export const GenericCard = <T extends BasePayload>({
  item,
  type = 'default',
  className = '',
  onClick,
}: GenericCardProps<T>) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'subject':
        return (
          <Icon
            className='text-blue-500 text-xl'
            icon='lucide:book'
          />
        );
      case 'level':
        return (
          <Icon
            className='text-primary text-xl'
            icon='lucide:bar-chart-2'
          />
        );
      case 'question-type':
        return (
          <Icon
            className='text-purple-500 text-xl'
            icon='lucide:help-circle'
          />
        );
      default:
        return (
          <Icon
            className='text-default-500 text-xl'
            icon='lucide:file'
          />
        );
    }
  };

  return (
    <Card
      isPressable
      className='overflow-visible hover:shadow-md transition-shadow duration-200'
      shadow='sm'
      onPress={() => onClick?.(item)}
    >
      <CardBody className='overflow-visible p-4'>
        <div className='flex gap-3'>
          <div className='flex-shrink-0 w-12 h-12 bg-default-100 rounded-md flex items-center justify-center'>
            {getIconByType(type)}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-medium text-sm line-clamp-2'>{item.name}</h3>
            <p className='text-xs text-default-500 line-clamp-2 mt-1'>
              {item.description || 'Không có mô tả'}
            </p>
            <div className='flex flex-col gap-0.5 mt-2 text-xs text-default-500'>
              <span>
                Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span>
                Cập nhật: {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
