import { Request, Response } from "express";
import { AddToCart } from "@domain/use-cases/cart/AddToCart";
import { ClearCart } from "@domain/use-cases/cart/ClearCart";
import { GetCart } from "@domain/use-cases/cart/GetCart";
import { UpdateCartItem } from "@domain/use-cases/cart/UpdateCartItem";
import { RemoveFromCart } from "@domain/use-cases/cart/RemoveFromCart";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const createCartController = (
    cartFinder: ICartFinder, 
    productFinder: IProductFinder, 
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const getCartCase = new GetCart(cartFinder);
    const addToCartCase = new AddToCart(cartFinder, productFinder, unitOfWorkFactory);
    const removeFromCartCase = new RemoveFromCart(cartFinder, productFinder, unitOfWorkFactory);
    const updateCartItemCase = new UpdateCartItem(cartFinder, productFinder, unitOfWorkFactory);
    const clearCartCase = new ClearCart(cartFinder, productFinder, unitOfWorkFactory);
    
    const getCart = async (req: AuthenticatedRequest, res: Response, next: Function) => {
        try {
            const cart = await getCartCase.execute(req.userId!);
            if (!cart) {
                return res.status(200).json(null);
            }
            res.status(200).json(cart);
        } catch (err: any) {
            next(err);
        }
    };

    const addProductToCart = async (req: AuthenticatedRequest, res: Response, next: Function) => {
        try {
            const { productId, quantity } = req.body;
            await addToCartCase.execute(req.userId!, productId, quantity);
            res.status(200).json({ message: "Product added to cart" });
        } catch (err: any) {
            next(err);
        }
    };

    const removeProductFromCart = async (req: AuthenticatedRequest, res: Response, next: Function) => {
        try {
            const { productId } = req.params;            await removeFromCartCase.execute(req.userId!, productId);
            res.status(200).json({ message: "Product removed from cart" });
        } catch (err: any) {
            next(err);
        }
    };
    const updateCartItem = async (req: AuthenticatedRequest, res: Response, next: Function) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            await updateCartItemCase.execute(req.userId!, productId, quantity);
            res.status(200).json({ message: "CartComponent item quantity updated" });
        } catch (err: any) {
            next(err);
        }
    };

    const clearCart = async (req: AuthenticatedRequest, res: Response, next: Function) => {
        try {
            await clearCartCase.execute(req.userId!);
            res.status(200).json({ message: "CartComponent cleared" });
        } catch (err: any) {
            next(err);
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