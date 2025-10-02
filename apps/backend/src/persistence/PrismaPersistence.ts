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
        try {
            // Mapeamos el DTO de la base de datos a la entidad de dominio.
            // El constructor de la entidad validará las invariantes (ej. rol válido).
            return new User(user.id, user.name, user.email, user.passwordHash, user.role as any, user.createdAt);
        } catch (error: any) {
            // Si la entidad no se puede construir, los datos de la BD son inconsistentes.
            console.error(`Data integrity issue for user ${user.id}: ${error.message}`);
            throw new Error(`Failed to map database data to User entity for user ID ${user.id}.`);
        }
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        try {
            return new User(user.id, user.name, user.email, user.passwordHash, user.role as any, user.createdAt);
        } catch (error: any) {
            console.error(`Data integrity issue for user ${user.id}: ${error.message}`);
            throw new Error(`Failed to map database data to User entity for user ID ${user.id}.`);
        }
    }

    // IProductFinder
    async findProductById(id: string): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return null;
        try {
            // El constructor de Product valida que el precio y el stock no sean negativos.
            return new Product(product.id, product.name, product.description, product.price, product.stock, product.createdAt);
        } catch (error: any) {
            console.error(`Data integrity issue for product ${product.id}: ${error.message}`);
            throw new Error(`Failed to map database data to Product entity for product ID ${product.id}.`);
        }
    }

    async findAllProducts(): Promise<Product[]> {
        const productsData = await prisma.product.findMany();
        return productsData.map(p => {
            try {
                return new Product(p.id, p.name, p.description, p.price, p.stock, p.createdAt);
            } catch (error: any) {
                // En una lista, podríamos optar por omitir el producto inválido y loggear el error.
                console.error(`Skipping product with ID ${p.id} due to data integrity issue: ${error.message}`);
                return null;
            }
        }).filter((p): p is Product => p !== null); // Filtramos los nulos
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
            try {
                // Reconstituimos la entidad Product, que validará sus propias invariantes.
                const product = new Product(item.product.id, item.product.name, item.product.description, item.product.price, item.product.stock, item.product.createdAt);
                return new CartItem(product, item.quantity);
            } catch (error: any) {
                // Si un producto en el carrito tiene datos corruptos, lo omitimos y loggeamos el error.
                console.error(`Skipping item with product ID ${item.productId} in cart ${cart.id} due to data integrity issue: ${error.message}`);
                return null;
            }
        }).filter((item): item is CartItem => item !== null);

        return new Cart(cart.id, cart.userId, cartItems);
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) return null;

        const cartItems = cart.items.map(item => {
            try {
                const product = new Product(item.product.id, item.product.name, item.product.description, item.product.price, item.product.stock, item.product.createdAt);
                return new CartItem(product, item.quantity);
            } catch (error: any) {
                console.error(`Skipping item with product ID ${item.productId} in cart ${cart.id} due to data integrity issue: ${error.message}`);
                return null;
            }
        }).filter((item): item is CartItem => item !== null);

        return new Cart(cart.id, cart.userId, cartItems);
    }
}