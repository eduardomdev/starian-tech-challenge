export interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserGeolocation {
  lat: string;
  long: string;
}

export interface UserAddress {
  geolocation: UserGeolocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: UserName;
  address?: UserAddress;
  phone?: string;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password: string;
  name?: UserName;
  phone?: string;
}
