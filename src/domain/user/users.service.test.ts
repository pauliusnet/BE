import FacebookClient from '../../external/facebook-client/facebook-client';
import { InvalidFacebookAccessToken } from '../../external/facebook-client/facebook-client.errors';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './users.errors';
import { UserDoesNotExist } from './users.repository.errors';
import { UserRole } from '../../entities/role-entity.types';
import UsersRepository from './users.repository';
import UsersService from './users.service';

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
    const invalidFacebookToken = 'invalid_acess_token';
    const validFacebookToken = 'valid_acess_token';
    const jwtAccessToken = 'jwt_token';

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

            await expect(service.handleUserAuthentication({ accessToken: invalidFacebookToken })).rejects.toThrow(
                UnauthorizedError
            );
        });

        it('should throw general error if any other error occurs', async () => {
            jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockRejectedValue(new Error('error'));

            await expect(service.handleUserAuthentication({ accessToken: invalidFacebookToken })).rejects.toThrow(
                Error
            );
            await expect(service.handleUserAuthentication({ accessToken: invalidFacebookToken })).rejects.not.toThrow(
                UnauthorizedError
            );
        });

        it('should throw Unauthorized if facebook access token is invalid for getting user details', async () => {
            jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockRejectedValue(
                new InvalidFacebookAccessToken('error')
            );

            await expect(service.handleUserAuthentication({ accessToken: invalidFacebookToken })).rejects.toThrow(
                UnauthorizedError
            );
        });

        it('should update user if he/she exists', async () => {
            jest.spyOn(UsersRepository.prototype, 'getUser').mockResolvedValue(applicationUserDetails);
            const updateExistingUserSpy = jest.spyOn(UsersRepository.prototype, 'updateUser').mockResolvedValue();

            await service.handleUserAuthentication({ accessToken: validFacebookToken });

            expect(updateExistingUserSpy).toHaveBeenCalled();
        });

        it('should create new user if he/she does not exist', async () => {
            jest.spyOn(UsersRepository.prototype, 'getUser').mockRejectedValueOnce(new UserDoesNotExist('error'));
            const addNewUserSpy = jest.spyOn(UsersRepository.prototype, 'createUser').mockResolvedValue();

            await service.handleUserAuthentication({ accessToken: validFacebookToken });

            expect(addNewUserSpy).toHaveBeenCalled();
        });

        it('should return jwt', async () => {
            jest.spyOn(JwtManager.prototype, 'generateJwt').mockReturnValue(jwtAccessToken);

            const actual = await service.handleUserAuthentication({ accessToken: validFacebookToken });

            expect(actual).toEqual(jwtAccessToken);
        });
    });
});
