export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface IUserAddress {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface UserProfileDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: IUserAddress;
  image: string;
  role: string;
}
