import { User } from "../entities/User";
import { AuthService } from "../services/AuthService";
import * as crypto from "crypto";

export class RegisterUser {
    constructor(private authService: AuthService) {}

    async execute(name: string, email: string, password: string): Promise<User> {
        const passwordHash = await this.authService.hashPassword(password);
        return new User(
            crypto.randomUUID(),
            name,
            email,
            passwordHash,
            'client',
            new Date()
        );
    }
}
