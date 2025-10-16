import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { AddToCart } from "../use-cases/AddToCart";

// --- Mocking Dependencies ---
const mockProductFinder = {
    findProductById: jest.fn(),
    findAllProducts: jest.fn(),
};

const mockCartFinder = {
    findByUserId: jest.fn(), // Lo mantenemos por si otros tests lo usan
    findOrCreateByUserId: jest.fn(),
};

const mockUnitOfWork = {
    products: { 
        save: jest.fn(),
        update: jest.fn(),
    },
    users: { save: jest.fn() },
    carts: { save: jest.fn() },
    commit: jest.fn().mockResolvedValue(undefined),
};

const mockUowFactory = {
    create: () => mockUnitOfWork,
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Cart", () => {
    it("should add items to a new cart and calculate total", async () => {
        // Arrange
        // Usamos el método estático `create` para instanciar las entidades, como en la aplicación.
        const product1 = Product.create({ name: "Mouse Gamer", description: "RGB", price: 5000, stock: 10, imageUrl: 'url1', createdAt: new Date() }, new UniqueEntityID("p1"));
        const product2 = Product.create({ name: "Teclado", description: "Mecánico", price: 8000, stock: 5, imageUrl: 'url2', createdAt: new Date() }, new UniqueEntityID("p2"));
        const userId = "user-1";
        
        // Creamos la instancia del carrito usando el método estático `create`.
        const cart = Cart.create({
            userId: new UniqueEntityID(userId),
            items: []
        }, new UniqueEntityID("cart-1"));

        // El buscador de carritos encontrará o creará este carrito.
        mockCartFinder.findOrCreateByUserId.mockResolvedValue(cart);
        // El buscador de productos encontrará los productos que queremos añadir.
        mockProductFinder.findProductById
            .mockResolvedValueOnce(product1)
            .mockResolvedValueOnce(product2);

        const addToCart = new AddToCart(mockCartFinder, mockProductFinder, mockUowFactory);

        // Act
        // El método execute ahora es `void`, no devuelve nada. Simplemente modifica el estado.
        // Pasamos el ID como string.
        await addToCart.execute(userId, product1.id.toString(), 2);
        await addToCart.execute(userId, product2.id.toString(), 1);

        // Assert
        // Verificamos el estado del objeto `cart` que fue manipulado por el caso de uso.
        expect(cart.items.length).toBe(2);
        expect(cart.items[0].quantity).toBe(2); // Mouse
        expect(cart.items[1].quantity).toBe(1); // Teclado
        // Usamos el getter `total` en lugar de un método.
        expect(cart.total).toBe(18000); // (5000 * 2) + (8000 * 1)
        
        // Verificamos que se intentó guardar el estado final
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledTimes(2);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(2);
        
        // Verificamos que el stock se actualizó
        expect(product1.stock).toBe(8);
        expect(product2.stock).toBe(4);
    });
});
