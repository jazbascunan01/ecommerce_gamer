import { RegisterUser } from "../use-cases";
import { AuthService } from "../services/AuthService";
import { UserAlreadyExistsError } from "../errors/DomainError";
import { User } from "../entities/User";
import { UniqueEntityID } from "../core/UniqueEntityID";
import {
    mockUserFinder,
    mockUowFactory,
    mockUnitOfWork,
    resetMocks,
} from "./_mocks";

const authService = new AuthService();

beforeEach(() => {
    resetMocks();
});

describe("RegisterUser Use Case", () => {
    it("should create a new user, hash the password, and save it", async () => {
        mockUserFinder.findByEmail.mockResolvedValue(null);

        const registerUser = new RegisterUser(mockUserFinder, mockUowFactory, authService);

        const user = await registerUser.execute("Karen", "karen@example.com", "password123");

        expect(user.id).toBeDefined();
        expect(user.passwordHash).not.toBe("password123");
        expect(user.role).toBe("CUSTOMER");

        expect(mockUnitOfWork.users.save).toHaveBeenCalledTimes(1);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });

    it("should throw UserAlreadyExistsError if email is already in use", async () => {
        const existingUser = User.create({
            name: "Otro Nombre",
            email: "karen@example.com",
            passwordHash: "hash",
            role: "CUSTOMER",
            createdAt: new Date()
        }, new UniqueEntityID("id-existente"));
        mockUserFinder.findByEmail.mockResolvedValue(existingUser);

        const registerUser = new RegisterUser(mockUserFinder, mockUowFactory, authService);

        try {
            await registerUser.execute("Karen", "karen@example.com", "password123");
            fail("Expected RegisterUser.execute to throw an error, but it did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(UserAlreadyExistsError);
        }

        expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
    });
});
