import FacebookClient from '../../external/facebook-client/facebook-client';
import { InvalidFacebookAccessToken } from '../../external/facebook-client/facebook-client.errors';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './users.errors';
import { UserAuthenticationRequestDto } from './users.types';
import { UserDoesNotExist } from './users.repository.errors';
import { UserInfoDto } from './users.types';
import UsersRepository from './users.repository';

class UsersService {
    facebookClient = new FacebookClient();
    usersRepository = new UsersRepository();
    jwtManager = new JwtManager();

    async handleUserAuthentication(userAuthenticationRequest: UserAuthenticationRequestDto): Promise<string> {
        try {
            await this.facebookClient.validateAccessToken(userAuthenticationRequest.accessToken);
            const userInfo = await this.facebookClient.getUserDetails(userAuthenticationRequest.accessToken);
            await this.createOrUpdateUser(userInfo);
            const { email, role } = await this.usersRepository.getUser(userInfo.email);

            return this.jwtManager.generateJwt({ email, role });
        } catch (error) {
            if (error instanceof InvalidFacebookAccessToken) {
                throw new UnauthorizedError('Invalid facebook access token');
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
}

export default UsersService;
