import { RegisterUser } from "../use-cases";
import { AuthService } from "../services/AuthService";
import { UserAlreadyExistsError } from "../errors/DomainError";
import { User } from "../entities/User";
import { UniqueEntityID } from "../core/UniqueEntityID";

const mockUserFinder = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
};

const mockUnitOfWork = {
    users: {
        save: jest.fn().mockImplementation(user => Promise.resolve(user)),
    },
    products: {
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    carts: { save: jest.fn() },
    commit: jest.fn().mockResolvedValue(undefined),
};

const mockUowFactory = {
    create: () => mockUnitOfWork,
};

const authService = new AuthService();

beforeEach(() => {
    jest.clearAllMocks();
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
