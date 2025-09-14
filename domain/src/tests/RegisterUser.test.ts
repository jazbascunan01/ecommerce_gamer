import { RegisterUser } from "../use-cases/RegisterUser";
import { AuthService } from "../services/AuthService";

describe("RegisterUser", () => {
    it("should create a new user with hashed password", async () => {
        const authService = new AuthService();
        const register = new RegisterUser(authService);

        const user = await register.execute("Karen", "karen@example.com", "password123");

        expect(user.id).toBeDefined();
        expect(user.passwordHash).not.toBe("password123");
        expect(user.role).toBe("client");
    });
});
