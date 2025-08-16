// User Types
export interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  role: "student" | "instructor" | "admin";
  is_email_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  bio?: string;
  phone?: string;
  role?: "student" | "instructor" | "admin";
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  role: "student" | "instructor" | "admin";
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

// Authentication Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Payload Type
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
