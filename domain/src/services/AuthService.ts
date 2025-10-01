import * as crypto from "crypto";

export class AuthService {
    async hashPassword(password: string): Promise<string> {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    }
}
