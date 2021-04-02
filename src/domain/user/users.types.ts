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
}

export interface UserAuthenticationRequestDto {
    accessToken: string;
}

export interface UserAuthenticationResponseDto {
    jwt: string;
}
