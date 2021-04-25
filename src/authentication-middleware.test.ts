import { SecurityMethod, UserRole } from './entities/role-entity.types';
import { UnauthorizedError } from './domain/user/users.errors';
import { expressAuthentication } from './authentication-middleware';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

describe('Authentication middleware', () => {
    const getMockedRequest = (authorization?: string): Request =>
        (({
            headers: { authorization },
        } as unknown) as Request);

    describe('jwt security method', () => {
        it('should throw Unauthorized if there is no authorization header', async () => {
            await expect(expressAuthentication(getMockedRequest(undefined), SecurityMethod.Jwt)).rejects.toThrow(
                UnauthorizedError
            );
        });

        it('should throw Unauthorized if there is no access token provided', async () => {
            await expect(expressAuthentication(getMockedRequest('Bearer '), SecurityMethod.Jwt)).rejects.toThrow(
                UnauthorizedError
            );
        });

        it('should throw Unauthorized if access token is invalid', async () => {
            await expect(
                expressAuthentication(getMockedRequest('Bearer invalid_token'), SecurityMethod.Jwt)
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should resolve if access token is valid', async () => {
            jest.spyOn(
                jwt,
                'verify'
            ).mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
                cb(null, { email: 'sad.asda', role: UserRole.Admin })
            );

            await expect(
                expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt)
            ).resolves.not.toThrow();
        });

        it('should throw Unauthorized if user role is not available in decoded object', async () => {
            jest.spyOn(
                jwt,
                'verify'
            ).mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
                cb(null, { email: 'sad.asda' })
            );

            await expect(
                expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Admin])
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should throw Unauthorized if user role does not match any described access scopes', async () => {
            jest.spyOn(
                jwt,
                'verify'
            ).mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
                cb(null, { email: 'sad.asda', role: UserRole.Customer })
            );

            await expect(
                expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Admin])
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should resolve if user role does match a described access scope', async () => {
            jest.spyOn(
                jwt,
                'verify'
            ).mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
                cb(null, { email: 'sad.asda', role: UserRole.Customer })
            );

            await expect(
                expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [UserRole.Customer])
            ).resolves.not.toThrow();
        });

        it('should resolve if user role is admin', async () => {
            jest.spyOn(
                jwt,
                'verify'
            ).mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
                cb(null, { email: 'sad.asda', role: UserRole.Admin })
            );

            await expect(
                expressAuthentication(getMockedRequest('Bearer valid_token'), SecurityMethod.Jwt, [])
            ).resolves.not.toThrow();
        });
    });

    describe('static token security method', () => {
        it('should throw Unauthorized if there is no authorization header', async () => {
            await expect(
                expressAuthentication(getMockedRequest(undefined), SecurityMethod.StaticToken)
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should throw Unauthorized if there is authorization header does not match static token', async () => {
            await expect(
                expressAuthentication(getMockedRequest('incorrectToken'), SecurityMethod.StaticToken)
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should resolve if provided authorization header matches static token', async () => {
            await expect(
                expressAuthentication(getMockedRequest(process.env.STATIC_TOKEN), SecurityMethod.StaticToken)
            ).resolves.not.toThrow();
        });
    });
});
