import { InvalidJwt } from './jwt-manager.errors';
import jwt from 'jsonwebtoken';

class JwtManager {
    generateAccessToken(payload: Record<string, unknown>): string {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' });
    }

    generateRefreshToken(payload: Record<string, unknown>): string {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    }

    async decodeAccessToken(accessToken: string): Promise<Record<string, unknown>> {
        return this.decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    }

    async decodeRefreshToken(refreshToken: string): Promise<Record<string, unknown>> {
        return this.decodeToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }

    private decodeToken(token: string, secret: string): Promise<Record<string, unknown>> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    reject(new InvalidJwt(err.message));
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
export default JwtManager;
