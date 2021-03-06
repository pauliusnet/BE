import FacebookClient from '../../external/facebook-client/facebook-client';
import JwtManager from '../../external/jwt-manager/jwt-manager';
import Role from '../../entities/role-entity';
import User from '../../entities/user-entity';
import { UserRole } from '../../entities/role-entity.types';
import { UsersController } from './users.controller';
import { useTestDatabase } from '../../test-support/database-helpers';
import UserBuilder from '../../test-data/user-builder';
import { Request } from 'express';
import { BadRequest } from '../../common/common.errors';

describe('Users API tests', () => {
    useTestDatabase();

    describe('POST /authenticate', () => {
        const validFacebookToken = 'valid_acess_token';
        const accessToken = 'jwt_token';
        const refreshToken = 'jwt_refresh_token';
        const facebookUserDetails = {
            name: 'Lucas',
            email: '12@asdsad.lw',
            pictureURL: '12.asd.asd',
        };
        const defaultRole = { id: 2, type: UserRole.Customer };

        beforeEach(() => {
            jest.spyOn(FacebookClient.prototype, 'validateAccessToken').mockResolvedValue();
            jest.spyOn(FacebookClient.prototype, 'getUserDetails').mockResolvedValue(facebookUserDetails);
            jest.spyOn(JwtManager.prototype, 'generateAccessToken').mockReturnValue(accessToken);
            jest.spyOn(JwtManager.prototype, 'generateRefreshToken').mockReturnValue(refreshToken);
        });

        it('should create a new user, assign default customer role to him/her and return a generated jwt', async () => {
            const controller = new UsersController();

            const actual = await controller.authenticate({ facebookAccessToken: validFacebookToken });

            expect(actual).toEqual({ accessToken });
            const addedUser = await User.findOne({ email: facebookUserDetails.email }, { relations: ['role'] });
            expect(addedUser).toEqual({ ...facebookUserDetails, id: 1, role: defaultRole });
        });

        it('should update an existing user and return a generated jwt', async () => {
            const controller = new UsersController();
            const user = new UserBuilder().withEmail(facebookUserDetails.email).build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            const actual = await controller.authenticate({ facebookAccessToken: validFacebookToken });

            expect(actual).toEqual({ accessToken });
            const updatedUser = await User.findOne({ email: facebookUserDetails.email }, { relations: ['role'] });
            expect(updatedUser).toEqual({ ...facebookUserDetails, id: user.id, role: defaultRole });
            expect(controller.getHeader('Set-Cookie')).toEqual([`refreshToken=${refreshToken}; path=/; HttpOnly`]);
        });
    });

    describe('POST /refresh-token', () => {
        const accessToken = 'jwt_token';
        const refreshToken = 'jwt_refresh_token';
        const email = 'test@test.com';

        beforeEach(() => {
            jest.spyOn(JwtManager.prototype, 'generateAccessToken').mockReturnValue(accessToken);
            jest.spyOn(JwtManager.prototype, 'decodeRefreshToken').mockResolvedValue({ email });
        });

        it('should refresh and return new access token', async () => {
            const controller = new UsersController();
            const user = new UserBuilder().withEmail(email).build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            const actual = await controller.refreshToken({ cookies: { refreshToken } } as Request);

            expect(actual).toEqual({ accessToken });
        });
    });

    describe('PATCH /change-role', () => {
        it('should update user role', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await new UsersController().changeRole({ email: user.email, role: UserRole.Instructor });

            expect((await User.findOneOrFail({ email: user.email }, { relations: ['role'] })).role.type).toEqual(
                UserRole.Instructor
            );
        });

        it('should throw bad request error if provided email does not exist', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await expect(
                new UsersController().changeRole({ email: 'incorrect_email', role: UserRole.Instructor })
            ).rejects.toThrow(BadRequest);
        });

        it('should throw bad request error if provided role does not exist', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await expect(
                new UsersController().changeRole({ email: user.email, role: ('incorrect_role' as unknown) as UserRole })
            ).rejects.toThrow(BadRequest);
        });
    });

    describe('PATCH /change-role-with-static-token', () => {
        it('should update user role', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await new UsersController().changeRoleWithStaticToken({ email: user.email, role: UserRole.Instructor });

            expect((await User.findOneOrFail({ email: user.email }, { relations: ['role'] })).role.type).toEqual(
                UserRole.Instructor
            );
        });

        it('should throw bad request error if provided email does not exist', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await expect(
                new UsersController().changeRoleWithStaticToken({ email: 'incorrect_email', role: UserRole.Instructor })
            ).rejects.toThrow(BadRequest);
        });

        it('should throw bad request error if provided role does not exist', async () => {
            const user = new UserBuilder().build();
            user.role = await Role.findOneOrFail({ type: UserRole.Customer });
            await user.save();

            await expect(
                new UsersController().changeRoleWithStaticToken({
                    email: user.email,
                    role: ('incorrect_role' as unknown) as UserRole,
                })
            ).rejects.toThrow(BadRequest);
        });
    });
});
