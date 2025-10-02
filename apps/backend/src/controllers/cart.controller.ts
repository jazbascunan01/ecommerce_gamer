import { Request, Response } from "express";
import { AddToCart } from "@domain/use-cases/AddToCart";
import { ClearCart } from "@domain/use-cases/ClearCart";
import { GetCart } from "@domain/use-cases/GetCart";
import { UpdateCartItem } from "@domain/use-cases/UpdateCartItem";
import { RemoveFromCart } from "@domain/use-cases/RemoveFromCart";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { ProductNotFoundError, InsufficientStockError, InvalidQuantityError, CartNotFoundError, ProductNotInCartError } from "@domain/errors/DomainError";

// Extendemos la interfaz Request para incluir userId
interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const createCartController = (
    cartFinder: ICartFinder, 
    productFinder: IProductFinder, 
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    
    const getCart = async (req: AuthenticatedRequest, res: Response) => {
        const getCartCase = new GetCart(cartFinder);
        try {
            const cart = await getCartCase.execute(req.userId!); // No se necesita await aquí, pero es inofensivo
            res.json(cart);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };

    const addProductToCart = async (req: AuthenticatedRequest, res: Response) => {
        const addToCartCase = new AddToCart(cartFinder, productFinder, unitOfWorkFactory);
        try {
            const { productId, quantity } = req.body;
            await addToCartCase.execute(req.userId!, productId, quantity);
            res.status(200).json({ message: "Product added to cart" });
        } catch (err: any) {
            if (err instanceof ProductNotFoundError) {
                return res.status(404).json({ error: err.message });
            }
            if (err instanceof InsufficientStockError || err instanceof InvalidQuantityError) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    const removeProductFromCart = async (req: AuthenticatedRequest, res: Response) => {
        const removeFromCartCase = new RemoveFromCart(cartFinder, productFinder, unitOfWorkFactory);
        try {
            const { productId } = req.body;
            await removeFromCartCase.execute(req.userId!, productId);
            res.json({ message: "Product removed from cart" });
        } catch (err: any) {
            // Mejoramos el manejo de errores
            if (err instanceof ProductNotFoundError) {
                return res.status(404).json({ error: err.message });
            }
            if (err instanceof CartNotFoundError || err instanceof ProductNotInCartError) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };
    const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
        const updateCartItemCase = new UpdateCartItem(cartFinder, productFinder, unitOfWorkFactory);
        try {
            const { productId, quantity } = req.body;
            await updateCartItemCase.execute(req.userId!, productId, quantity);
            res.status(200).json({ message: "Cart item quantity updated" });
        } catch (err: any) {
            // Mejoramos el manejo de errores
            if (err instanceof ProductNotFoundError || err instanceof CartNotFoundError) {
                return res.status(404).json({ error: err.message });
            }
            if (err instanceof InsufficientStockError || err instanceof InvalidQuantityError || err instanceof ProductNotInCartError) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    const clearCart = async (req: AuthenticatedRequest, res: Response) => {
        const clearCartCase = new ClearCart(cartFinder, productFinder, unitOfWorkFactory);
        try {
            await clearCartCase.execute(req.userId!);
            res.status(200).json({ message: "Cart cleared" });
        } catch (err: any) {
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    return {
        getCart,
        addProductToCart,
        removeProductFromCart,
        updateCartItem,
        clearCart,
    };
};