import { LoginDTO, IAuthResponse } from '../../models/auth.model';

export class AuthMapper {
  static toAuthResponse(dto: LoginDTO): IAuthResponse {
    return {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      user: {
        id: dto.id,
        username: dto.username,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        image: dto.image,
      },
    };
  }
}
