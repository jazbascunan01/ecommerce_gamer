import { AuthService } from "../services/AuthService";
import { LoginUser } from "../use-cases/LoginUser";
import { User } from "../entities/User";
import { InvalidCredentialsError, UserNotFoundError } from "../errors/DomainError";

// --- Mocking Dependencies ---
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
        // Arrange
        const userInDb = new User(
            "user-1", "Karen", "karen@example.com",
            await authService.hashPassword("password123"), "CUSTOMER"
        );
        mockUserFinder.findByEmail.mockResolvedValue(userInDb);
        const loginUser = new LoginUser(mockUserFinder, authService);
        
        // Act
        const loggedInUser = await loginUser.execute("karen@example.com", "password123");
        
        // Assert
        expect(loggedInUser.name).toBe("Karen");
    });

    it("should throw error if email not found", async () => {
        // Arrange
        mockUserFinder.findByEmail.mockResolvedValue(null);
        const loginUser = new LoginUser(mockUserFinder, authService);

        // Act & Assert
        await expect(
            loginUser.execute("noone@example.com", "password123")
        ).rejects.toThrow(UserNotFoundError);
    });

    it("should throw error if password is wrong", async () => {
        // Arrange
        const userInDb = new User(
            "user-1", "Karen", "karen@example.com",
            await authService.hashPassword("password123"), "CUSTOMER"
        );
        mockUserFinder.findByEmail.mockResolvedValue(userInDb);
        const loginUser = new LoginUser(mockUserFinder, authService);

        // Act & Assert
        await expect(
            loginUser.execute("karen@example.com", "wrongpassword")
        ).rejects.toThrow(InvalidCredentialsError);
    });
});
