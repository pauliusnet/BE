import { UserRole } from '../../entities/role-entity.types';

export interface UserInfoDto {
    name: string;
    pictureURL: string;
    email: string;
}

export interface GetUserDto {
    id: number;
    pictureURL: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface UserAuthenticationRequestDto {
    accessToken: string;
}

export interface UserAuthenticationResponseDto {
    jwt: string;
}
