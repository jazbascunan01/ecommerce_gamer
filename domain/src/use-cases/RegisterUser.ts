import { User } from "../entities/User";
import { AuthService } from "../services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "../services/IPersistence";
import * as crypto from "crypto";
import { UserAlreadyExistsError } from "../errors/DomainError";

export class RegisterUser {
    constructor(
        private userFinder: IUserFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory,
        private authService: AuthService
    ) {}

    async execute(name: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userFinder.findByEmail(email);
        if (existingUser) {
            throw new UserAlreadyExistsError(email);
        }

        const passwordHash = await this.authService.hashPassword(password);
        const user = new User(
            crypto.randomUUID(),
            name,
            email,
            passwordHash,
            'client',
            new Date()
        );

        const uow = this.unitOfWorkFactory.create();
        uow.users.save(user);
        await uow.commit();

        return user;
    }
}
