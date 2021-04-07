import FacebookClient from '../../external/facebook-client/facebook-client';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import Role from '../../entities/role-entity';
import User from '../../entities/user-entity';
import { UserRole } from '../../entities/role-entity.types';
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
    const defaultRole = { id: 2, type: UserRole.Customer };

    beforeEach(() => {
        jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockResolvedValue();
        jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockResolvedValue(facebookUserDetails);
        jest.spyOn(JwtManager.prototype, 'generateJwt').mockReturnValue(jwtAccessToken);
    });

    it('should create a new user, assign default customer role to him/her and return a generated jwt', async () => {
        const controller = new UsersController();

        const actual = await controller.authenticate({ accessToken: validFacebookToken });

        expect(actual).toEqual({ jwt: jwtAccessToken });
        const addedUser = await User.findOne({ email: facebookUserDetails.email }, { relations: ['role'] });
        expect(addedUser).toEqual({ ...facebookUserDetails, id: 1, role: defaultRole });
    });

    it('should update an existing user and return a generated jwt', async () => {
        const controller = new UsersController();
        const user = new User();
        user.name = 'Paulius';
        user.email = facebookUserDetails.email;
        user.pictureURL = 'picture';
        const role = await Role.findOneOrFail({ type: UserRole.Customer });
        user.role = role;
        await user.save();

        const actual = await controller.authenticate({ accessToken: validFacebookToken });

        expect(actual).toEqual({ jwt: jwtAccessToken });
        const updatedUser = await User.findOne({ email: facebookUserDetails.email }, { relations: ['role'] });
        expect(updatedUser).toEqual({ ...facebookUserDetails, id: user.id, role: defaultRole });
    });
});
