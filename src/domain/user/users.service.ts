import FacebookClient from '../../external/facebook-client/facebook-client';
import { InvalidFacebookAccessToken } from '../../external/facebook-client/facebook-client.errors';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './users.errors';
import { UserAuthenticationRequestDto } from './users.types';
import { UserDoesNotExist } from './users.repository.errors';
import { UserInfoDto } from './users.types';
import UsersRepository from './users.repository';
import { InvalidJwt } from '../../external/jwt-manager/jwt-manager.errors';

class UsersService {
    facebookClient = new FacebookClient();
    usersRepository = new UsersRepository();
    jwtManager = new JwtManager();

    async handleUserAuthentication(
        userAuthenticationRequest: UserAuthenticationRequestDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            await this.facebookClient.validateAccessToken(userAuthenticationRequest.facebookAccessToken);
            const userInfo = await this.facebookClient.getUserDetails(userAuthenticationRequest.facebookAccessToken);
            await this.createOrUpdateUser(userInfo);
            const { email, role } = await this.usersRepository.getUser(userInfo.email);

            return {
                accessToken: this.jwtManager.generateAccessToken({ email, role }),
                refreshToken: this.jwtManager.generateRefreshToken({ email }),
            };
        } catch (error) {
            if (error instanceof InvalidFacebookAccessToken) {
                throw new UnauthorizedError(`Invalid facebook access token: ${error.message}`);
            }
            throw error;
        }
    }

    private async createOrUpdateUser(userInfo: UserInfoDto): Promise<void> {
        if (await this.doesUserExist(userInfo.email)) {
            await this.usersRepository.updateUser(userInfo);
        } else {
            await this.usersRepository.createUser(userInfo);
        }
    }

    private async doesUserExist(email: string): Promise<boolean> {
        try {
            await this.usersRepository.getUser(email);
            return true;
        } catch (error) {
            if (error instanceof UserDoesNotExist) {
                return false;
            }
            throw error;
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<string> {
        try {
            const { email } = await this.jwtManager.decodeRefreshToken(refreshToken);
            const { role } = await this.usersRepository.getUser(email as string);
            return this.jwtManager.generateAccessToken({ email, role });
        } catch (error) {
            if (error instanceof InvalidJwt) {
                throw new UnauthorizedError(`Refresh token has expired: ${error.message}`);
            }
            throw error;
        }
    }
}

export default UsersService;
