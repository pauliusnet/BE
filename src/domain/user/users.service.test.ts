import FacebookClient from '../../external/facebook-client/facebook-client';
import { InvalidFacebookAccessToken } from '../../external/facebook-client/facebook-client.errors';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './users.errors';
import { UserDoesNotExist } from './users.repository.errors';
import { UserRole } from '../../entities/role-entity.types';
import UsersRepository from './users.repository';
import UsersService from './users.service';
import { InvalidJwt } from '../../external/jwt-manager/jwt-manager.errors';

describe('Users service', () => {
    const service = new UsersService();
    const facebookUserDetails = {
        name: 'Thomas',
        email: '1sa.23.w2',
        pictureURL: '12ss/ss',
    };
    const applicationUserDetails = {
        ...facebookUserDetails,
        id: 12,
        role: UserRole.Customer,
    };
    const invalidFacebookToken = 'invalid_access_token';
    const validFacebookToken = 'valid_access_token';
    const jwtAccessToken = 'jwt_token';
    const jwtRefreshToken = 'jwt_refresh_token';

    describe('#handleUserAuthentication', () => {
        beforeEach(() => {
            jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockResolvedValue();
            jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockResolvedValue(facebookUserDetails);
            jest.spyOn(UsersRepository.prototype, 'getUser').mockResolvedValue(applicationUserDetails);
            jest.spyOn(UsersRepository.prototype, 'updateUser').mockResolvedValue();
        });

        it('should throw Unauthorized if facebook access token is invalid', async () => {
            jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockRejectedValue(
                new InvalidFacebookAccessToken('error')
            );

            await expect(
                service.handleUserAuthentication({ facebookAccessToken: invalidFacebookToken })
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should throw general error if any other error occurs', async () => {
            jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockRejectedValue(new Error('error'));

            await expect(
                service.handleUserAuthentication({ facebookAccessToken: invalidFacebookToken })
            ).rejects.toThrow(Error);
            await expect(
                service.handleUserAuthentication({ facebookAccessToken: invalidFacebookToken })
            ).rejects.not.toThrow(UnauthorizedError);
        });

        it('should throw Unauthorized if facebook access token is invalid for getting user details', async () => {
            jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockRejectedValue(
                new InvalidFacebookAccessToken('error')
            );

            await expect(
                service.handleUserAuthentication({ facebookAccessToken: invalidFacebookToken })
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should update user if he/she exists', async () => {
            jest.spyOn(UsersRepository.prototype, 'getUser').mockResolvedValue(applicationUserDetails);
            const updateExistingUserSpy = jest.spyOn(UsersRepository.prototype, 'updateUser').mockResolvedValue();

            await service.handleUserAuthentication({ facebookAccessToken: validFacebookToken });

            expect(updateExistingUserSpy).toHaveBeenCalled();
        });

        it('should create new user if he/she does not exist', async () => {
            jest.spyOn(UsersRepository.prototype, 'getUser').mockRejectedValueOnce(new UserDoesNotExist('error'));
            const addNewUserSpy = jest.spyOn(UsersRepository.prototype, 'createUser').mockResolvedValue();

            await service.handleUserAuthentication({ facebookAccessToken: validFacebookToken });

            expect(addNewUserSpy).toHaveBeenCalled();
        });

        it('should return access and refresh tokens', async () => {
            jest.spyOn(JwtManager.prototype, 'generateAccessToken').mockReturnValue(jwtAccessToken);
            jest.spyOn(JwtManager.prototype, 'generateRefreshToken').mockReturnValue(jwtRefreshToken);

            const actual = await service.handleUserAuthentication({ facebookAccessToken: validFacebookToken });

            expect(actual).toEqual({ accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
        });
    });

    describe('#refreshAccessToken', () => {
        beforeEach(() => {
            jest.spyOn(UsersRepository.prototype, 'getUser').mockResolvedValue(applicationUserDetails);
            jest.spyOn(JwtManager.prototype, 'decodeRefreshToken').mockResolvedValue({
                email: applicationUserDetails.email,
            });
            jest.spyOn(JwtManager.prototype, 'generateAccessToken').mockReturnValue(jwtAccessToken);
        });

        it('should create new access token', async () => {
            const actual = await service.refreshAccessToken(jwtRefreshToken);

            expect(actual).toBe(jwtAccessToken);
        });

        it('should throw Unauthorized error if refresh token is invalid', async () => {
            jest.spyOn(JwtManager.prototype, 'decodeRefreshToken').mockRejectedValue(new InvalidJwt('Invalid'));

            await expect(service.refreshAccessToken(jwtRefreshToken)).rejects.toThrow(UnauthorizedError);
        });

        it('should throw general error if any other error occurs', async () => {
            jest.spyOn(JwtManager.prototype, 'decodeRefreshToken').mockRejectedValue(new Error('error'));

            await expect(service.refreshAccessToken(jwtRefreshToken)).rejects.toThrow(Error);
            await expect(service.refreshAccessToken(jwtRefreshToken)).rejects.not.toThrow(UnauthorizedError);
        });
    });
});
