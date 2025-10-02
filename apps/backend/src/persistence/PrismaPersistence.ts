import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Product } from "@domain/entities/Product";
import { User } from "@domain/entities/User";
import { ICartFinder, IProductFinder, IUnitOfWork, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { PrismaPromise } from "@prisma/client";
import prisma from "../prisma-client";

class PrismaUnitOfWork implements IUnitOfWork {
    public users: { save: (user: User) => void; };
    public products: { save: (product: Product) => void; update: (product: Product) => void; };    public carts: { save: (cart: Cart) => void; };

    private operations: PrismaPromise<any>[] = [];

    constructor() {
        this.users = {
            save: (user) => {
                this.operations.push(prisma.user.create({ data: { ...user } }));
            }
        };
        this.products = {
            save: (product) => {
                this.operations.push(prisma.product.create({ data: { ...product } }));
            },
            update: (product) => {
                this.operations.push(prisma.product.update({ where: { id: product.id }, data: { stock: product.stock } }));
            }
        };
        this.carts = {
            save: (cart) => {
                const cartItemsData = cart.items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                }));
                this.operations.push(
                    prisma.cart.update({
                        where: { id: cart.id },
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
    // IUnitOfWorkFactory
    create(): IUnitOfWork {
        return new PrismaUnitOfWork();
    }

    // IUserFinder
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        // Validamos que el rol de la BD sea uno de los roles de dominio permitidos
        if (user.role !== 'client' && user.role !== 'admin') {
            // Opcional: puedes loggear una advertencia o lanzar un error si un rol inválido está en la BD
            throw new Error(`Invalid role '${user.role}' found in database for user ${user.id}`);
        }
        return new User(user.id, user.name, user.email, user.passwordHash, user.role, user.createdAt);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        // Validamos que el rol de la BD sea uno de los roles de dominio permitidos
        if (user.role !== 'client' && user.role !== 'admin') {
            // Opcional: puedes loggear una advertencia o lanzar un error si un rol inválido está en la BD
            throw new Error(`Invalid role '${user.role}' found in database for user ${user.id}`);
        }
        return new User(user.id, user.name, user.email, user.passwordHash, user.role, user.createdAt);
    }

    // IProductFinder
    async findProductById(id: string): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return null;
        return new Product(product.id, product.name, product.description, product.price, product.stock, product.createdAt);
    }

    async findAllProducts(): Promise<Product[]> {
        const products = await prisma.product.findMany();
        return products.map(p => new Product(p.id, p.name, p.description, p.price, p.stock, p.createdAt));
    }

    // ICartFinder
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

        const cartItems = cart.items.map(item => {
            const product = new Product(item.product.id, item.product.name, item.product.description, item.product.price, item.product.stock, item.product.createdAt);
            return new CartItem(product, item.quantity);
        });

        return new Cart(cart.id, cart.userId, cartItems);
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) return null;

        const cartItems = cart.items.map(item => {
            const product = new Product(item.product.id, item.product.name, item.product.description, item.product.price, item.product.stock, item.product.createdAt);
            return new CartItem(product, item.quantity);
        });

        return new Cart(cart.id, cart.userId, cartItems);
    }
}