import { Product } from "@domain/entities/Product";
import { User } from "@domain/entities/User";
import { IUnitOfWork, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { Prisma } from "@prisma/client";
import prisma from "../prisma-client";
import { Cart } from "@domain/entities/Cart";

class PrismaUnitOfWork implements IUnitOfWork {
    public users: { save: (user: User) => Promise<User>; };
    public products: { save: (product: Product) => void; update: (product: Product) => void; delete: (product: Product) => void; };
    public carts: { save: (cart: Cart) => void; };

    private operations: Prisma.PrismaPromise<any>[] = [];

    constructor() {
        this.users = {
            save: (user: User) => {
                const op = prisma.user.create({ data: {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        passwordHash: user.passwordHash,
                        role: user.role,
                        createdAt: user.createdAt
                    } });
                this.operations.push(op);
                return op as unknown as Promise<User>;
            }
        };
        this.products = {
            save: (product) => {
                this.operations.push(prisma.product.create({
                    data: {
                        id: product.id.toString(),
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        imageUrl: product.imageUrl,
                        createdAt: product.createdAt
                    }
                }));
            },
            update: (product) => {
                this.operations.push(prisma.product.update({
                    where: { id: product.id.toString() },
                    data: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        imageUrl: product.imageUrl
                    }
                }));
            },
            delete: (product) => {
                this.operations.push(prisma.product.delete({ where: { id: product.id.toString() } }));
            }
        };
        this.carts = {
            save: (cart) => {
                const cartItemsData = cart.items.map(item => ({
                    productId: item.product.id.toString(),
                    quantity: item.quantity,
                }));
                this.operations.push(
                    prisma.cart.update({
                        where: { id: cart.id.toString() },
                        data: {
                            items: {
                                deleteMany: {},
                                create: cartItemsData,
                            },
                        },
                    })
                );
            }
        };
    }

    async commit(): Promise<void> {
        await prisma.$transaction(this.operations);
    }
}

/**
 * Implementa la factoría de Unit of Work.
 * Su única responsabilidad es crear una nueva instancia de PrismaUnitOfWork.
 */
export class PrismaPersistence implements IUnitOfWorkFactory {
    create(): IUnitOfWork {
        return new PrismaUnitOfWork();
    }
}