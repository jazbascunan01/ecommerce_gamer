import { Router } from "express";
import { AuthService } from "@domain/services/AuthService";
import prisma from "../prisma-client";

const router = Router();
const authService = new AuthService();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const passwordHash = await authService.hashPassword(password);

        const user = await prisma.user.create({
            data: { name, email, passwordHash, role: 'client' }
        });

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await authService.comparePassword(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export { router as userRoutes };
