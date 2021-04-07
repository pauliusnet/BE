import { SecurityMethod, UserRole } from './entities/role-entity.types';

import JwtManager from './external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './domain/user/users.errors';

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<void> {
    if (securityName === SecurityMethod.Jwt) {
        const authHeader = request.headers['authorization'];
        const jwtToken = authHeader?.split('Bearer ')[1];

        if (!jwtToken) throw new UnauthorizedError('No JWT has been provided.');

        const { role } = await new JwtManager().decodeJwt(jwtToken);
        const isValidRole = typeof role === 'string' && (scopes.includes(role) || role === UserRole.Admin);
        if (!isValidRole) throw new UnauthorizedError('Invalid user access scope');
    }
}
