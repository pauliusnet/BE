import { Request as ExpressRequest } from 'express';
import { RefreshTokenResponseDto, UserAuthenticationRequestDto, UserAuthenticationResponseDto } from './users.types';
import { Body, Controller, Post, Route, Request } from '@tsoa/runtime';
import UsersService from './users.service';

@Route('/users')
export class UsersController extends Controller {
    usersService = new UsersService();

    @Post('/login')
    async authenticate(
        @Body() userAuthenticationRequest: UserAuthenticationRequestDto
    ): Promise<UserAuthenticationResponseDto> {
        const { accessToken, refreshToken } = await this.usersService.handleUserAuthentication(
            userAuthenticationRequest
        );
        this.setHeader('Set-Cookie', [`refreshToken=${refreshToken}; path=/; HttpOnly`]);
        return { accessToken };
    }

    @Post('/refresh-token')
    async refreshToken(@Request() request: ExpressRequest): Promise<RefreshTokenResponseDto> {
        return { accessToken: await this.usersService.refreshAccessToken(request.cookies.refreshToken) };
    }
}
