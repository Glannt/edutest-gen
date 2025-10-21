export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponseData {
  token?: string;
  userId?: number;
  username?: string;
  full_name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  user?: any;
}
