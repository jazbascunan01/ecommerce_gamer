import { User } from "../../entities/User";
import { InvalidCredentialsError, UserNotFoundError } from "../../errors/DomainError";
import { AuthService } from "../../services/AuthService";
import { IUserFinder } from "../../services/IPersistence";

export class LoginUser {
    constructor(
        private userFinder: IUserFinder,
        private authService: AuthService
    ) {}

    async execute(email: string, password: string): Promise<User> {
        const user = await this.userFinder.findByEmail(email);
        if (!user) {
            throw new UserNotFoundError(email);
        }

        const isPasswordValid = await this.authService.comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        return user;
    }
}
