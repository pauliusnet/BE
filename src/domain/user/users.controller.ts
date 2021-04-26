import { Request as ExpressRequest } from 'express';
import {
    ChangeUserRoleRequestDto,
    GetUserDto,
    RefreshTokenResponseDto,
    UserAuthenticationRequestDto,
    UserAuthenticationResponseDto,
} from './users.types';
import { Body, Controller, Post, Route, Request, Patch, Security, Get } from '@tsoa/runtime';
import UsersService from './users.service';
import { SecurityMethod } from '../../entities/role-entity.types';
import { RoleDoesNotExist, UserDoesNotExist } from './users.repository.errors';
import { BadRequest } from '../../common/common.errors';

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

    @Get()
    @Security(SecurityMethod.Jwt)
    async getAllUsers(): Promise<GetUserDto[]> {
        return await this.usersService.getAllUsers();
    }

    @Patch('/change-role')
    @Security(SecurityMethod.Jwt)
    async changeRole(@Body() changeUserRoleRequest: ChangeUserRoleRequestDto): Promise<void> {
        try {
            await this.usersService.changeUserRole(changeUserRoleRequest);
        } catch (error) {
            if (error instanceof UserDoesNotExist) {
                throw new BadRequest('User with provided email does not exist');
            }
            if (error instanceof RoleDoesNotExist) {
                throw new BadRequest('Role with provided type does not exist');
            }
            throw error;
        }
    }

    @Patch('/change-role-with-static-token')
    @Security(SecurityMethod.StaticToken)
    async changeRoleWithStaticToken(@Body() changeUserRoleRequest: ChangeUserRoleRequestDto): Promise<void> {
        try {
            await this.usersService.changeUserRole(changeUserRoleRequest);
        } catch (error) {
            if (error instanceof UserDoesNotExist) {
                throw new BadRequest('User with provided email does not exist');
            }
            if (error instanceof RoleDoesNotExist) {
                throw new BadRequest('Role with provided type does not exist');
            }
            throw error;
        }
    }
}
