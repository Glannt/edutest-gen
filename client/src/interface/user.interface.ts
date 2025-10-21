export interface UserInterface {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'TEACHER';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  actions?: string; // cho GenericTable
}
