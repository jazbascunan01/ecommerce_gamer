import { User } from "../../entities/User";
import { AuthService } from "../../services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "../../services/IPersistence";
import { UserAlreadyExistsError } from "../../errors/DomainError";

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
        
        const user = User.create({
            name,
            email,
            passwordHash,
            role: 'CUSTOMER',
            createdAt: new Date()
        });

        const uow = this.unitOfWorkFactory.create();
        const savedUser = await uow.users.save(user);
        await uow.commit();

        return savedUser;
    }
}