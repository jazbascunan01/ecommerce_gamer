import { User } from "../entities/User";
import { AuthService } from "../services/AuthService";

export class LoginUser {
    constructor(private authService: AuthService, private users: User[]) {}

    async execute(email: string, password: string): Promise<User> {
        const user = this.users.find(u => u.email === email);
        if (!user) throw new Error("User not found");

        const passwordHash = await this.authService.hashPassword(password);
        if (passwordHash !== user.passwordHash) {
            throw new Error("Invalid password");
        }

        return user;
    }
}
