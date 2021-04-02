import { UserAuthenticationRequestDto, UserAuthenticationResponseDto } from './users.types';
import { Body, Controller, Post, Route, SuccessResponse } from '@tsoa/runtime';
import UsersService from './users.service';

@Route('/users')
export class UsersController extends Controller {
    usersService = new UsersService();

    @SuccessResponse('200', 'Success')
    @Post('/login')
    async authenticate(
        @Body() userAuthenticationRequest: UserAuthenticationRequestDto
    ): Promise<UserAuthenticationResponseDto> {
        const jwt = await this.usersService.handleUserAuthentication(userAuthenticationRequest);
        return { jwt };
    }
}
