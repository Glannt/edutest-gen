export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponseData {
  token?: string;
  userId?: number;
  username?: string;
  email?: string;
  role?: string;
  user?: any;
}
