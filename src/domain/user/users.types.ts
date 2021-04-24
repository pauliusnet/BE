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
    facebookAccessToken: string;
}

export interface UserAuthenticationResponseDto {
    accessToken: string;
}

export type RefreshTokenResponseDto = UserAuthenticationResponseDto;

export interface ChangeUserRoleRequestDto {
    email: string;
    role: UserRole;
}

export type ChangeUserRoleDto = ChangeUserRoleRequestDto;
