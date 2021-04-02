import JwtManager from './external/jwt-manager/jwt-manager';
import { UnauthorizedError } from './domain/user/users.errors';

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<void> {
    const authHeader = request.headers['authorization'];
    const jwtToken = authHeader?.split('Bearer ')[1];

    if (!jwtToken) throw new UnauthorizedError('No JWT has been provided.');

    await new JwtManager().decodeJwt(jwtToken);

    if (securityName || scopes) {
        // TODO: Implement this
    }
}
