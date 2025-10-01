import { Router } from "express";
import prisma from "../prisma-client";

const router = Router();

// Crear producto
router.post("/", async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const product = await prisma.product.create({
            data: { name, description, price, stock }
        });
        res.json(product);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Listar productos
router.get("/", async (req, res) => {
    const result = await prisma.product.findMany();
    res.json(result);
});

export { router as productRoutes };
