import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Product } from "@domain/entities/Product";
import { User } from "@domain/entities/User";
import { ICartFinder, IProductFinder, IUnitOfWork, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { Prisma, PrismaPromise } from "@prisma/client";import prisma from "../prisma-client";
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
        userId: new UniqueEntityID(cart.userId),        items: cartItems,
    }, new UniqueEntityID(cart.id));
};

class PrismaUnitOfWork implements IUnitOfWork {
    public users: { save: (user: User) => Promise<User>; };
    public products: { save: (product: Product) => void; update: (product: Product) => void; delete: (product: Product) => void; };
    public carts: { save: (cart: Cart) => void; };

    private operations: PrismaPromise<any>[] = [];

    constructor() {
        this.users = {
            save: (user: User) => {
                const op = prisma.user.create({ data: {
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

export class PrismaPersistence implements ICartFinder, IProductFinder, IUserFinder, IUnitOfWorkFactory {
    create(): IUnitOfWork {
        return new PrismaUnitOfWork();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        try {
            return User.create({
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                role: user.role as any,
                createdAt: user.createdAt
            }, new UniqueEntityID(user.id));
        } catch (error: any) {
            console.error(`Data integrity issue for user ${user.id}: ${error.message}`);
            throw new Error(`Failed to map database data to User entity for user ID ${user.id}.`);
        }
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        try {
            return User.create({
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                role: user.role as any,
                createdAt: user.createdAt
            }, new UniqueEntityID(user.id));
        } catch (error: any) {
            console.error(`Data integrity issue for user ${user.id}: ${error.message}`);
            throw new Error(`Failed to map database data to User entity for user ID ${user.id}.`);
        }
    }

    async findProductById(id: string): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return null;
        try {
            return Product.create({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt
            }, new UniqueEntityID(product.id));
        } catch (error: any) {
            console.error(`Data integrity issue for product ${product.id}: ${error.message}`);
            throw new Error(`Failed to map database data to Product entity for product ID ${product.id}.`);
        }
    }

    async findAllProducts(): Promise<Product[]> {
        const productsData = await prisma.product.findMany();
        return productsData.map(p => {
            try {
                return Product.create({
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    imageUrl: p.imageUrl,
                    createdAt: p.createdAt
                }, new UniqueEntityID(p.id));
            } catch (error: any) {
                console.error(`Skipping product with ID ${p.id} due to data integrity issue: ${error.message}`);
                return null;
            }
        }).filter((p): p is Product => p !== null);
    }

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
