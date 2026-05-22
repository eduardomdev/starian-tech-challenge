export interface LoginModel {
  username: string;
  password: string;
}

export interface RegisterModel {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserPayload {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
