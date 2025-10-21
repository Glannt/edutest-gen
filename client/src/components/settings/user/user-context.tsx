import React, { createContext, useContext, useEffect, useState } from 'react';

// 🧩 Kiểu dữ liệu cho user
export interface AuthUser {
  user_id: number;
  full_name: string;
  username: string;
  email: string;
  role: string;
  notifications?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private';
    activityStatus: boolean;
    showLastSeen: boolean;
  };
  appearance?: {
    darkMode: boolean;
    compactMode: boolean;
    highContrast: boolean;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface UserContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => void;
  handleDeleteAccount: () => void;
  handleInputChange: (field: keyof AuthUser, value: string) => void;
  handleNestedChange: (
    category: keyof AuthUser,
    field: string,
    value: any
  ) => void;
}

export const UserContext = createContext<UserContextType>({
  auth: { user: null, token: null },
  setAuth: () => {},
  logout: () => {},
  handleDeleteAccount: () => {},
  handleInputChange: (field, value) => {},
  handleNestedChange: (category, field, value) => {},
});

export const useUserContext = () => useContext(UserContext);

// 🧠 Lấy dữ liệu user từ localStorage (nếu có)
function getStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem('auth-edutest-storage');

    if (!raw) return { user: null, token: null };

    const parsed = JSON.parse(raw);

    return {
      user: parsed.state?.user ?? null,
      token: parsed.state?.token ?? null,
    };
  } catch (error) {
    console.error('Failed to parse auth-edutest-storage:', error);

    return { user: null, token: null };
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>(getStoredAuth);

  // 🔁 Tự động cập nhật khi localStorage thay đổi (ví dụ tab khác login/logout)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth-edutest-storage') {
        setAuth(getStoredAuth());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('auth-edutest-storage');
    setAuth({ user: null, token: null });
  };
  const handleDeleteAccount = () => {
    // ví dụ: xoá dữ liệu user và logout
    console.log('Deleting account for user:', auth.user);
    logout();
  };

  const handleInputChange = (field: keyof AuthUser, value: string) => {
    if (!auth.user) return;
    setAuth((prev) => ({
      ...prev,
      user: { ...prev.user!, [field]: value },
    }));
  };

  const handleNestedChange = (
    category: keyof AuthUser,
    field: string,
    value: any
  ) => {
    if (!auth.user) return;
    setAuth((prev) => ({
      ...prev,
      user: {
        ...prev.user!,
        [category]: { ...(prev.user as any)[category], [field]: value },
      },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        auth,
        setAuth,
        logout,
        handleDeleteAccount,
        handleInputChange,
        handleNestedChange,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
