import { Router } from "express";
import { Cart } from "@domain/entities/Cart";
import { AddToCart } from "@domain/use-cases/AddToCart";
import { RemoveFromCart } from "@domain/use-cases/RemoveFromCart";
import { GetCartTotal } from "@domain/use-cases/GetCartTotal";
import { Product } from "@domain/entities/Product";

// Instancias (simulación en memoria)
const router = Router();
const cart = new Cart();
const addToCart = new AddToCart(cart);
const removeFromCart = new RemoveFromCart(cart);
const getCartTotal = new GetCartTotal(cart);

// Endpoint para agregar producto al carrito
router.post("/add", (req, res) => {
    try {
        const { product, quantity } = req.body;

        // Simulación: crear un producto temporal (en la vida real buscarías por id)
        const p = new Product(product.id, product.name, product.description, product.price, product.stock, new Date());
        addToCart.execute(p, quantity);

        res.json({ message: "Product added to cart", cart: cart.items });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Endpoint para remover producto del carrito
router.post("/remove", (req, res) => {
    try {
        const { productId } = req.body;
        removeFromCart.execute(productId);
        res.json({ message: "Product removed from cart", cart: cart.items });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Endpoint para obtener total
router.get("/total", (req, res) => {
    const total = getCartTotal.execute();
    res.json({ total });
});

export { router as cartRoutes };
