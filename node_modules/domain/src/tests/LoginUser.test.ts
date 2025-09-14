import { AuthService } from "../services/AuthService";
import { LoginUser } from "../use-cases/LoginUser";
import { User } from "../entities/User";
import * as crypto from "crypto";

describe("LoginUser", () => {
    let authService: AuthService;
    let users: User[];
    let loginUser: LoginUser;

    beforeEach(async () => {
        authService = new AuthService();
        users = [
            new User(
                crypto.randomUUID(),
                "Karen",
                "karen@example.com",
                await authService.hashPassword("password123"),
                "client",
                new Date()
            )
        ];
        loginUser = new LoginUser(authService, users);
    });

    it("should login with correct credentials", async () => {
        const user = await loginUser.execute("karen@example.com", "password123");
        expect(user.name).toBe("Karen");
    });

    it("should throw error if email not found", async () => {
        await expect(
            loginUser.execute("noone@example.com", "password123")
        ).rejects.toThrow("User not found");
    });

    it("should throw error if password is wrong", async () => {
        await expect(
            loginUser.execute("karen@example.com", "wrongpassword")
        ).rejects.toThrow("Invalid password");
    });
});
