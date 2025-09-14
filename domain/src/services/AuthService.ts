import * as crypto from "crypto";

export class AuthService {
    async hashPassword(password: string): Promise<string> {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
}
