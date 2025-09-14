import { Router } from "express";
import { AuthService } from "@domain/services/AuthService";
import { RegisterUser } from "@domain/use-cases/RegisterUser";
import { LoginUser } from "@domain/use-cases/LoginUser";
import { User } from "@domain/entities/User";
import * as crypto from "crypto";

const router = Router();
const authService = new AuthService();
const users: User[] = [];

// Registro
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const registerUser = new RegisterUser(authService);
        const user = await registerUser.execute(name, email, password);
        users.push(user);
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUser = new LoginUser(authService, users);
        const user = await loginUser.execute(email, password);
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export { router as userRoutes };
