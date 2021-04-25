import { SecurityMethod, UserRole } from './entities/role-entity.types';

import { InvalidJwt } from './external/jwt-manager/jwt-manager.errors';
import JwtManager from './external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './domain/user/users.errors';
import { Request } from 'express';

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes: string[] = []
): Promise<void> {
    if (securityName === SecurityMethod.Jwt) {
        try {
            const authHeader = request.headers['authorization'];
            const jwtToken = authHeader?.split('Bearer ')[1];

            if (!jwtToken) throw new UnauthorizedError('No JWT has been provided.');

            const { role } = await new JwtManager().decodeAccessToken(jwtToken);
            const isValidRole = typeof role === 'string' && (scopes.includes(role) || role === UserRole.Admin);
            if (!isValidRole) throw new UnauthorizedError('Invalid user access scope');
        } catch (error) {
            if (error instanceof InvalidJwt) {
                throw new UnauthorizedError('Invalid access token');
            }
            throw error;
        }
    } else if (securityName === SecurityMethod.StaticToken) {
        const authHeader = request.headers['authorization'];
        if (authHeader !== process.env.STATIC_TOKEN) throw new UnauthorizedError('Invalid static token');
    }
}
