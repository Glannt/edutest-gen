import { ChipProps } from '@heroui/react';

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};
