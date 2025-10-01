import { Router } from "express";
import prisma from "../prisma-client";

const router = Router();

// Middleware: Autenticación y gestión del carrito
router.use(async (req, res, next) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(401).json({ error: "User ID header is required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Busca o crea un carrito para el usuario
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Adjuntamos el usuario y el id del carrito a la request para usarlo en otras rutas
        (req as any).user = user;
        (req as any).cartId = cart.id;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Ver contenido del carrito
router.get("/", async (req, res) => {
    const cartId = (req as any).cartId;
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    res.json(cart);
});

// Agregar producto al carrito
router.post("/add", async (req, res) => {
    try {
        const cartId = (req as any).cartId;
        const { productId, quantity } = req.body;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock" });
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId, productId }
        });

        if (existingItem) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
            res.json({ message: "Product quantity updated", item: updatedItem });
        } else {
            // Si no, crea un nuevo item en el carrito
            const newItem = await prisma.cartItem.create({
                data: { cartId, productId, quantity }
            });
            res.json({ message: "Product added to cart", item: newItem });
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Remover producto del carrito
router.post("/remove", async (req, res) => {
    try {
        const cartId = (req as any).cartId;
        const { productId } = req.body;

        const deletedItem = await prisma.cartItem.deleteMany({
            where: { cartId, productId }
        });

        if (deletedItem.count === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        res.json({ message: "Product removed from cart" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener total del carrito
router.get("/total", async (req, res) => {
    const cartId = (req as any).cartId;
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { product: true } } }
    });

    if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.json({ total });
});

export { router as cartRoutes };
