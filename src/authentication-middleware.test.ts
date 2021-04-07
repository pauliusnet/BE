import { SecurityMethod, UserRole } from './entities/role-entity.types';

import { InvalidJwt } from './external/jwt-manager/jwt-manager.errors';
import { UnauthorizedError } from './domain/user/users.errors';
import { expressAuthentication } from './authentication-middleware';
import jwt from 'jsonwebtoken';

describe('Authentication middleware', () => {
    const getMockedRequest = (authorization?: string): Request =>
        (({
            headers: { authorization },
        } as unknown) as Request);

    it('should resolve if there is no security method defined', async () => {
        await expect(expressAuthentication(getMockedRequest(undefined), undefined)).resolves;
    });

    it('should throw Unauthorized if there is no authentication header', async () => {
        await expect(expressAuthentication(getMockedRequest(undefined), SecurityMethod.Jwt)).rejects.toThrow(
            UnauthorizedError
        );
    });

    it('should throw Unauthorized if there is no jwt token provided', async () => {
        await expect(expressAuthentication(getMockedRequest('Bearer '), SecurityMethod.Jwt)).rejects.toThrow(
            UnauthorizedError
        );
    });

    it('should throw InvalidJwt if jwt token is invalid', async () => {
        await expect(
            expressAuthentication(getMockedRequest('Bearer invalid_token'), SecurityMethod.Jwt)
        ).rejects.toThrow(InvalidJwt);
    });

    it('should resolve if jwt token is valid', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda' })
        );

        await expect(expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt)).resolves;
    });

    it('should throw Unauthorized if user role is not available in decoded object', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda' })
        );

        await expect(
            expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Admin])
        ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw Unauthorized if user role does not match any described access scopes', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda', userRole: UserRole.Customer })
        );

        await expect(
            expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Admin])
        ).rejects.toThrow(UnauthorizedError);
    });

    it('should resolve if user role does match a described access scope', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda', userRole: UserRole.Customer })
        );

        await expect(
            expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Customer])
        ).resolves;
    });

    it('should resolve if user role is admin', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda', userRole: UserRole.Admin })
        );

        await expect(expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [])).resolves;
    });
});
