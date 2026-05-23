export interface UserName {
  firstname: string;
  lastname: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: UserName;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password: string;
}
