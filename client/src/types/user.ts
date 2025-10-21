export type User = {
  user_id: number;
  full_name: string;
  username: string;
  email: string;
  isActive: boolean;
  //   refresh_token?: string
  role: 'ADMIN' | 'TEACHER';
};

export type UserPayload = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  isActive: boolean;
  password?: string;
  //   refresh_token?: string
  role: 'ADMIN' | 'TEACHER';
  createdAt?: string;
  updatedAt?: string;
};
