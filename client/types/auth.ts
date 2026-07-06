export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface LoginResult {
  admin: AdminProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthContextValue {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAdmin: (admin: AdminProfile | null) => void;
  logout: () => void;
}
