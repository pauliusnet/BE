import { InvalidJwt } from './external/jwt-manager/jwt-manager.errors';
import { UnauthorizedError } from './domain/user/users.errors';
import { expressAuthentication } from './authentication-middleware';
import jwt from 'jsonwebtoken';

describe('Authentication middleware', () => {
    const getMockedRequest = (authorization?: string): Request =>
        (({
            headers: { authorization },
        } as unknown) as Request);

    it('should throw Unauthorized if there is no authentication header', async () => {
        await expect(expressAuthentication(getMockedRequest(undefined), 'jwt')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw Unauthorized if there is no jwt token provided', async () => {
        await expect(expressAuthentication(getMockedRequest('Bearer '), 'jwt')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw InvalidJwt if jwt token is invalid', async () => {
        await expect(expressAuthentication(getMockedRequest('Bearer invalid_token'), 'jwt')).rejects.toThrow(
            InvalidJwt
        );
    });

    it('should resolve if jwt token is valid', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation((token: string, secret: string, cb: (error, decoded) => void) =>
            cb(null, { email: 'sad.asda' })
        );

        await expect(expressAuthentication(getMockedRequest('Bearer valid_token'), 'jwt')).resolves;
    });
});
