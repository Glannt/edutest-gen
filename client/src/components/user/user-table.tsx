import React, { useMemo, useState } from 'react';
import {
  SortDescriptor,
  Selection,
  Button,
  Tooltip,
  CircularProgress,
  useDisclosure,
  addToast,
} from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { INITIAL_VISIBLE_USER_COLUMNS, userColumns } from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';
import { TopContent } from '@/components/table/top-content';
import { EditIcon, EyeFilledIcon, RecycleBinIcon } from '@/components/icons';
import { UserPayload } from '@/types/user';
import { UserInterface } from '@/interface/user.interface';
import { ViewUserModal } from '@/components/user/view-user-modal';
import { EditUserModal } from '@/components/user/edit-user-modal';
import { DeleteUserModal } from '@/components/user/delete-user-modal';
import {
  useCreateUser,
  useDeleteUser,
  usePagedUsers,
  useUpdateUser,
} from '@/hooks/useUser';
import UserModal from '@/components/user/user-modal';
import { BottomContent } from '@/components/table/bottom-content';

export default function UserTable() {
  // ---- UI states ----
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_USER_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'username',
    direction: 'ascending',
  });
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [page, setPage] = useState(0);
  const hasSearchFilter = Boolean(filterValue);

  const statusOptions: StatusOptions[] = [
    { name: 'Hoạt động', uid: 'active' },
    { name: 'Ngừng hoạt động', uid: 'inactive' },
  ];

  const { data: usersPayload, isLoading } = usePagedUsers({
    page: page,
    size: rowsPerPage,
    sortBy: 'username',
    direction: 'asc',
  });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // ---- Map payload -> interface ----
  const users: UserInterface[] = useMemo(
    () =>
      (usersPayload?.content || []).map((u: UserPayload) => ({
        id: u.id,
        username: u.username,
        fullName: u.full_name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        actions: '',
      })),
    [usersPayload]
  );

  // ---- Table Data ----
  const { headerColumns, sortedItems } = useTableData<UserInterface>({
    data: users,
    columns: userColumns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    statusFilter,
    statusOptions,
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // ---- Render Cell ----
  const renderCell = React.useCallback(
    (user: UserInterface, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserInterface];

      switch (columnKey) {
        case 'username':
          return <span className='font-medium'>{user.username}</span>;
        case 'fullName':
          return <span>{user.fullName}</span>;
        case 'email':
          return <span className='text-default-500'>{user.email}</span>;
        case 'role':
          return <span>{user.role}</span>;
        case 'isActive':
          return (
            <span
              className={`font-semibold ${
                user.isActive == true ? 'text-success' : 'text-danger'
              }`}
            >
              {user.isActive == true ? 'Hoạt động' : 'Ngừng hoạt động'}
            </span>
          );
        case 'actions':
          return (
            <div className='space-x-2'>
              <Tooltip content='Chi tiết'>
                <Button
                  size='sm'
                  onPress={() => {
                    setSelectedUser({
                      id: user.id,
                      username: user.username,
                      full_name: user.fullName, // ✅ chuyển đổi đúng tên field backend
                      email: user.email,
                      isActive: user.isActive,
                      role: user.role,
                    });
                    viewModal.onOpen();
                  }}
                >
                  <EyeFilledIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>
              <Tooltip content='Chỉnh sửa'>
                <Button
                  size='sm'
                  onPress={() => {
                    setEditUser({
                      id: user.id,
                      username: user.username,
                      full_name: user.fullName,
                      email: user.email,
                      isActive: user.isActive,
                      role: user.role,
                    });
                    editModal.onOpen();
                  }}
                >
                  <EditIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>
              <Tooltip content='Xóa'>
                <Button
                  size='sm'
                  onPress={() => {
                    setSelectedUser({
                      id: user.id,
                      username: user.username,
                      full_name: user.fullName,
                      email: user.email,
                      isActive: user.isActive,
                      role: user.role,
                    });
                    deleteModal.onOpen();
                  }}
                >
                  <RecycleBinIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>
            </div>
          );
        case 'createdAt':
        case 'updatedAt':
          return new Date(cellValue as string).toLocaleDateString();
        default:
          return cellValue as string;
      }
    },
    []
  );

  // ---- Modal logic ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [newUser, setNewUser] = useState<Partial<UserInterface>>({
    username: '',
    fullName: '',
    email: '',
    role: 'TEACHER',
    isActive: true,
  });
  const [selectedUser, setSelectedUser] = useState<UserPayload | null>(null);
  const [editUser, setEditUser] = useState<UserPayload | null>(null);

  // ---- Handlers ----
  const handleInputChange = (field: string, value: string) =>
    setNewUser((prev: any) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      await createUser.mutateAsync(newUser);
      setIsModalOpen(false);
      addToast({ title: 'Tạo người dùng thành công', color: 'success' });
    } catch {
      addToast({ title: 'Lỗi khi tạo người dùng', color: 'danger' });
    }
  };

  const handleEditChange = <K extends keyof UserPayload>(
    field: K,
    value: UserPayload[K]
  ) => {
    if (!editUser) return;
    setEditUser({ ...editUser, [field]: value });
  };

  const handleEditSubmit = async () => {
    if (!editUser) return;
    try {
      await updateUser.mutateAsync({ id: editUser.id, payload: editUser });
      editModal.onClose();
      addToast({ title: 'Cập nhật thành công', color: 'success' });
    } catch {
      addToast({ title: 'Cập nhật lỗi', color: 'danger' });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser.mutateAsync(selectedUser.id);
      deleteModal.onClose();
      addToast({ title: 'Xóa thành công', color: 'success' });
    } catch {
      addToast({ title: 'Xóa lỗi', color: 'danger' });
    }
  };

  const topContentProps = {
    columns: userColumns,
    filterValue,
    statusFilter,
    statusOptions,
    total: users.length,
    visibleColumns,
    onClear: () => {
      setFilterValue('');
      setPage(1);
    },
    onColumnsChange: setVisibleColumns,
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    onSearchChange: (v?: string) => {
      setFilterValue(v || '');
      setPage(1);
    },
    onStatusChange: setStatusFilter,
  };

  const bottomContent = (
    <BottomContent
      page={page}
      pages={usersPayload?.totalPages ?? 1}
      //   selectedKeys={selectedKeys}
      //   totalItems={usersPayload?.totalElements ?? 0}
      //   totalSelected={
      //     selectedKeys === 'all'
      //       ? (usersPayload?.totalElements ?? 0)
      //       : selectedKeys.size
      //   }
      onNextPage={() =>
        page < (usersPayload?.totalPages ?? 1) && setPage(page + 1)
      }
      onPageChange={setPage}
      onPreviousPage={() => page > 1 && setPage(page - 1)}
    />
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CircularProgress title='Đang tải dữ liệu...' />
      </div>
    );
  }

  return (
    <>
      <GenericTable<UserInterface>
        bottomContent={bottomContent}
        columns={userColumns}
        data={users}
        filterValue={filterValue}
        hasSearchFilter={hasSearchFilter}
        headerColumns={headerColumns}
        page={page}
        renderCell={renderCell}
        rowsPerPage={rowsPerPage}
        selectedKeys={selectedKeys}
        setFilterValue={setFilterValue}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        setSelectedKeys={setSelectedKeys}
        setSortDescriptor={setSortDescriptor}
        setVisibleColumns={setVisibleColumns}
        sortDescriptor={sortDescriptor}
        sortedItems={sortedItems}
        topContent={
          <TopContent
            {...topContentProps}
            extraActions={
              <>
                <Button
                  color='primary'
                  onPress={() => setIsModalOpen(true)}
                >
                  Thêm mới
                </Button>
                <UserModal
                  handleInputChange={handleInputChange}
                  handleModalClose={() => setIsModalOpen(false)}
                  handleSubmit={handleSubmit}
                  isOpen={isModalOpen}
                  newUser={newUser}
                  onOpenChange={setIsModalOpen}
                />
              </>
            }
          />
        }
        visibleColumns={visibleColumns}
      />

      {selectedUser && (
        <ViewUserModal
          isOpen={viewModal.isOpen}
          user={selectedUser}
          onOpenChange={viewModal.onOpenChange}
        />
      )}

      {editUser && (
        <EditUserModal
          handleInputChange={handleEditChange}
          handleSubmit={handleEditSubmit}
          isOpen={editModal.isOpen}
          user={editUser}
          onOpenChange={editModal.onOpenChange}
        />
      )}

      {selectedUser && (
        <DeleteUserModal
          isOpen={deleteModal.isOpen}
          userName={selectedUser.username}
          onDelete={handleDelete}
          onOpenChange={deleteModal.onOpenChange}
        />
      )}
    </>
  );
}
