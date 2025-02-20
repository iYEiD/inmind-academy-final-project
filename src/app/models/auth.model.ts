import { UserDTO } from './user.model';

export interface LoginDTOModel {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}
