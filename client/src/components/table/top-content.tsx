import React from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
} from '@heroui/react';

import { ChevronDownIcon, SearchIcon } from '../icons';

import { StatusOptions } from '@/interface/status-option.interface';

interface Props {
  filterValue: string;
  onSearchChange: (value?: string) => void;
  onClear: () => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange: (keys: Selection) => void;
  onColumnsChange: (keys: any) => void;
  statusFilter: Selection;
  visibleColumns: Selection;
  statusOptions: StatusOptions[];
  columns: { name: string; uid: string }[];
  total: number;
  extraActions?: React.ReactNode;
}

export const TopContent: React.FC<Props> = ({
  filterValue,
  onSearchChange,
  onClear,
  onRowsPerPageChange,
  onStatusChange,
  onColumnsChange,
  statusFilter,
  visibleColumns,
  statusOptions,
  columns,
  total,
  extraActions,
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between gap-3 items-end'>
        <Input
          isClearable
          className='w-full sm:max-w-[44%]'
          placeholder='Search...'
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className='flex gap-3'>
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button
                endContent={<ChevronDownIcon className='text-small' />}
                variant='flat'
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode='multiple'
              onSelectionChange={onStatusChange}
            >
              {statusOptions.map((status) => (
                <DropdownItem
                  key={status.uid}
                  className='capitalize'
                >
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button
                endContent={<ChevronDownIcon className='text-small' />}
                variant='flat'
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode='multiple'
              onSelectionChange={onColumnsChange}
            >
              {columns.map((column) => (
                <DropdownItem
                  key={column.uid}
                  className='capitalize'
                >
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/* <Button
            color='primary'
            endContent={<PlusIcon />}
            variant='solid'
            onPress={() => {
              alert('Thêm mới');
            }}
          >
            Thêm mới
          </Button> */}
          {extraActions}
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <span className='text-default-400 text-small'>Total {total} items</span>
        <label className='flex items-center text-default-400 text-small'>
          Rows per page:
          <select
            className='bg-transparent outline-none text-default-400 text-small ml-1'
            onChange={onRowsPerPageChange}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
          </select>
        </label>
      </div>
    </div>
  );
};
