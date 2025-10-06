import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

import { Document } from '@/types/document';

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'document':
        return (
          <Icon
            className='text-primary text-xl'
            icon='lucide:file-text'
          />
        );
      case 'video':
        return (
          <Icon
            className='text-purple-500 text-xl'
            icon='lucide:video'
          />
        );
      case 'assignment':
        return (
          <Icon
            className='text-blue-500 text-xl'
            icon='lucide:bookmark'
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
    <Card className='overflow-visible'>
      <CardBody className='p-4'>
        <div className='flex gap-3'>
          <div className='flex-shrink-0 w-12 h-12 bg-default-100 rounded-md flex items-center justify-center'>
            {getIconByType(document.type)}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-medium text-sm line-clamp-2'>
              {document.title}
            </h3>
            <div className='flex items-center gap-1 text-xs text-default-500 mt-1'>
              <span>Ngày cập nhật: {document.updatedAt}</span>
            </div>
            <div className='flex items-center gap-1 text-xs text-default-500'>
              <span>Người soạn: {document.author}</span>
            </div>
            <div className='flex items-center gap-1 text-xs text-default-500'>
              <span>Số lượt tải: {document.downloads}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
