export type User = {
  user_id: number;
  full_name: string;
  username: string;
  email: string;
  //   refresh_token?: string
  role: 'ADMIN' | 'TEACHER';
};
