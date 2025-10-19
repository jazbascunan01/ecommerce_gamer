import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Product } from "@domain/entities/Product";
import { ICartFinder } from "@domain/services/IPersistence";
import { Prisma } from "@prisma/client";
import prisma from "../prisma-client";
import { UniqueEntityID } from "@domain/core/UniqueEntityID";

const cartWithItemsAndProduct = Prisma.validator<Prisma.CartDefaultArgs>()({
    include: { items: { include: { product: true } } },
});

type PrismaCartWithItems = Prisma.CartGetPayload<typeof cartWithItemsAndProduct>;

const cartFromPersistence = (cart: PrismaCartWithItems): Cart => {
    const cartItems = cart.items.map((item) => {
        try {
            const product = Product.create({
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                stock: item.product.stock,
                imageUrl: item.product.imageUrl,
                createdAt: item.product.createdAt,
            }, new UniqueEntityID(item.product.id));

            return CartItem.create({
                product: product,
                quantity: item.quantity,
            }, new UniqueEntityID(item.id));
        } catch (error: any) {
            console.error(`Skipping item with product ID ${item.productId} in cart ${cart.id} due to data integrity issue: ${error.message}`);
            return null;
        }
    }).filter((item): item is CartItem => item !== null);

    return Cart.create({
        userId: new UniqueEntityID(cart.userId),
        items: cartItems,
    }, new UniqueEntityID(cart.id));
};

export class PrismaCartRepository implements ICartFinder {
    async findOrCreateByUserId(userId: string): Promise<Cart> {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } },
            });
        }

        return cartFromPersistence(cart);
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) return null;

        return cartFromPersistence(cart);
    }
}