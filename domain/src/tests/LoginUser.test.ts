import { AuthService } from "../services/AuthService";
import { LoginUser } from "../use-cases";
import { User } from "../entities/User";
import { InvalidCredentialsError, UserNotFoundError } from "../errors/DomainError";
import { UniqueEntityID } from "../core/UniqueEntityID";

const mockUserFinder = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
};

const authService = new AuthService();

beforeEach(() => {
    jest.clearAllMocks();
});

describe("LoginUser", () => {
    it("should login with correct credentials", async () => {
        const userInDb = User.create(
            {
                name: "Karen",
                email: "karen@example.com",
                passwordHash: await authService.hashPassword("password123"),
                role: "CUSTOMER",
                createdAt: new Date(),
            }, new UniqueEntityID("user-1")
        );
        mockUserFinder.findByEmail.mockResolvedValue(userInDb);
        const loginUser = new LoginUser(mockUserFinder, authService);
        const loggedInUser = await loginUser.execute("karen@example.com", "password123");
        expect(loggedInUser.name).toBe("Karen");
    });

    it("should throw error if email not found", async () => {
        mockUserFinder.findByEmail.mockResolvedValue(null);
        const loginUser = new LoginUser(mockUserFinder, authService);

        try {
            await loginUser.execute("noone@example.com", "password123");
            fail("Expected LoginUser.execute to throw an error, but it did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(UserNotFoundError);
        }
    });

    it("should throw error if password is wrong", async () => {
        const userInDb = User.create(
            {
                name: "Karen",
                email: "karen@example.com",
                passwordHash: await authService.hashPassword("password123"),
                role: "CUSTOMER",
                createdAt: new Date(),
            }, new UniqueEntityID("user-1")
        );
        mockUserFinder.findByEmail.mockResolvedValue(userInDb);
        const loginUser = new LoginUser(mockUserFinder, authService);

        try {
            await loginUser.execute("karen@example.com", "wrongpassword");
            fail("Expected LoginUser.execute to throw an error, but it did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidCredentialsError);
        }
    });
});
