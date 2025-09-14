import { Router } from "express";
import { Cart } from "@domain/entities/Cart";
import { AddToCart } from "@domain/use-cases/AddToCart";
import { RemoveFromCart } from "@domain/use-cases/RemoveFromCart";
import { GetCartTotal } from "@domain/use-cases/GetCartTotal";
import { Product } from "@domain/entities/Product";

// Simulación: productos en memoria (reemplaza con DB después)
const products: Product[] = [
    new Product("1", "Mouse Gamer", "RGB 16000 DPI", 5999, 5, new Date()),
    new Product("2", "Teclado Mecánico", "Switch azul", 7999, 3, new Date()),
];

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
        const { productId, quantity } = req.body;

        const product = products.find(p => p.id === productId);
        if (!product) throw new Error("Product not found");

        new AddToCart(cart).execute(product, quantity);
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

// Listar productos disponibles
router.get("/products", (req, res) => {
    res.json(products);
});

export { router as cartRoutes };
