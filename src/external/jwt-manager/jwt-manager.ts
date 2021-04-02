import { InvalidJwt } from './jwt-manager.errors';
import jwt from 'jsonwebtoken';

class JwtManager {
    generateJwt(payload: Record<string, unknown>): string {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1800 });
    }

    async decodeJwt(jwtToken: string): Promise<Record<string, unknown>> {
        return new Promise((resolve, reject) => {
            jwt.verify(jwtToken, process.env.JWT_SECRET as string, (err, decoded) => {
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
