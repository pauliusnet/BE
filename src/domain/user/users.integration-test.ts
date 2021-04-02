import FacebookClient from '../../external/facebook-client/facebook-client';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import User from '../../entities/user-entity';
import { UsersController } from './users.controller';
import { useTestDatabase } from '../../test-support/database-helpers';

describe('Users API tests', () => {
    useTestDatabase();
    const validFacebookToken = 'valid_acess_token';
    const jwtAccessToken = 'jwt_token';
    const facebookUserDetails = {
        name: 'Lucas',
        email: '12@asdsad.lw',
        pictureURL: '12.asd.asd',
    };

    beforeEach(() => {
        jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockResolvedValue();
        jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockResolvedValue(facebookUserDetails);
        jest.spyOn(JwtManager.prototype, 'generateJwt').mockReturnValue(jwtAccessToken);
    });

    it('should create a new user and return a generated jwt', async () => {
        const controller = new UsersController();

        const actual = await controller.authenticate({ accessToken: validFacebookToken });

        expect(actual).toEqual({ jwt: jwtAccessToken });
        const addedUser = await User.findOne();
        expect(addedUser).toEqual({ ...facebookUserDetails, id: 1 });
    });

    it('should update an existing user and return a generated jwt', async () => {
        const controller = new UsersController();
        const user = new User();
        user.name = 'Paulius';
        user.email = facebookUserDetails.email;
        user.pictureURL = 'picture';
        await user.save();

        const actual = await controller.authenticate({ accessToken: validFacebookToken });

        expect(actual).toEqual({ jwt: jwtAccessToken });
        const updatedUser = await User.findOne();
        expect(updatedUser).toEqual({ ...facebookUserDetails, id: user.id });
    });
});
