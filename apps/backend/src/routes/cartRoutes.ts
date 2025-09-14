import { Router } from "express";
import { Cart } from "@domain/entities/Cart";
import { AddToCart } from "@domain/use-cases/AddToCart";
import { RemoveFromCart } from "@domain/use-cases/RemoveFromCart";
import { GetCartTotal } from "@domain/use-cases/GetCartTotal";
import { Product } from "@domain/entities/Product";

// Simulación en memoria de carritos por usuario
const carts: { [userId: string]: Cart } = {};

const router = Router();

// Middleware simple para obtener o crear carrito por userId
router.use((req, res, next) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(400).json({ error: "User ID header required" });
    if (!carts[userId]) carts[userId] = new Cart(userId);
    (req as any).cart = carts[userId];
    next();
});

// Agregar producto
router.post("/add", (req, res) => {
    try {
        const cart = (req as any).cart as Cart;
        const { product, quantity } = req.body;
        const p = new Product(product.id, product.name, product.description, product.price, product.stock, new Date());
        new AddToCart(cart).execute(p, quantity);
        res.json({ message: "Product added", cart: cart.items });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Remover producto
router.post("/remove", (req, res) => {
    try {
        const cart = (req as any).cart as Cart;
        const { productId } = req.body;
        new RemoveFromCart(cart).execute(productId);
        res.json({ message: "Product removed", cart: cart.items });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Total del carrito
router.get("/total", (req, res) => {
    const cart = (req as any).cart as Cart;
    const total = new GetCartTotal(cart).execute();
    res.json({ total });
});

export { router as cartRoutes };
