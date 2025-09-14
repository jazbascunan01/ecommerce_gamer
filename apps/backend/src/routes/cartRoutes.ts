import { Router } from "express";
import { Cart } from "@domain/entities/Cart";
import { AddToCart } from "@domain/use-cases/AddToCart";
import { RemoveFromCart } from "@domain/use-cases/RemoveFromCart";
import { GetCartTotal } from "@domain/use-cases/GetCartTotal";
import { Product } from "@domain/entities/Product";
import { User } from "@domain/entities/User";  // usuarios registrados
import { LoginUser, RegisterUser } from "@domain/use-cases"; // tus casos de uso

// Simulación: usuarios registrados
const users: User[] = [
    new User(
        "1",                     // id
        "Alice",                 // name
        "alice@email.com",       // email
        "hashedPassword1",       // passwordHash
        "client",                // role ('client' o 'admin')
        new Date()               // createdAt
    ),
    new User(
        "2",
        "Bob",
        "bob@email.com",
        "hashedPassword2",
        "client",
        new Date()
    )
];

// Simulación: productos en memoria
const products: Product[] = [
    new Product("1", "Mouse Gamer", "RGB 16000 DPI", 5999, 5, new Date()),
    new Product("2", "Teclado Mecánico", "Switch azul", 7999, 3, new Date()),
];

// Carritos asociados a usuarios
const userCarts: { [userId: string]: Cart } = {};

const router = Router();

// Middleware: autenticación simulada
router.use((req, res, next) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(400).json({ error: "User ID header required" });

    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!userCarts[userId]) userCarts[userId] = new Cart(userId);
    (req as any).cart = userCarts[userId];
    (req as any).user = user;
    next();
});

// Listar productos disponibles
router.get("/products", (req, res) => {
    res.json(products);
});

// Agregar producto al carrito
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

// Remover producto del carrito
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

// Obtener total del carrito
router.get("/total", (req, res) => {
    const cart = (req as any).cart as Cart;
    const total = new GetCartTotal(cart).execute();
    res.json({ total });
});

export { router as cartRoutes };
