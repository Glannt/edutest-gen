import UserTable from '@/components/user/user-table';

export default function UserPage() {
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Quản lý tài khoản</h1>
        <UserTable />
      </div>
    </>
  );
}
