import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
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
        const product1 = new Product("p1", "Mouse Gamer", "RGB", 5000, 10, new Date());
        const product2 = new Product("p2", "Teclado", "Mecánico", 8000, 5, new Date());
        const userId = "user-1";
        const cart = new Cart("cart-1", userId); // Creamos una instancia de carrito que nuestro mock devolverá

        // El buscador de carritos encontrará o creará este carrito.
        mockCartFinder.findOrCreateByUserId.mockResolvedValue(cart);
        // El buscador de productos encontrará los productos que queremos añadir.
        mockProductFinder.findProductById.mockResolvedValueOnce(product1).mockResolvedValueOnce(product2);

        const addToCart = new AddToCart(mockCartFinder, mockProductFinder, mockUowFactory);

        // Act
        // El método execute ahora es `void`, no devuelve nada. Simplemente modifica el estado.
        await addToCart.execute(userId, product1.id!, 2);
        await addToCart.execute(userId, product2.id!, 1);

        // Assert
        // Verificamos el estado del objeto `cart` que fue manipulado por el caso de uso.
        expect(cart.items.length).toBe(2);
        expect(cart.items[0].quantity).toBe(2); // Mouse
        expect(cart.items[1].quantity).toBe(1); // Teclado
        expect(cart.getTotal()).toBe(18000); // (5000 * 2) + (8000 * 1)
        
        // Verificamos que se intentó guardar el estado final
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledTimes(2);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(2);
        
        // Verificamos que el stock se actualizó
        expect(product1.stock).toBe(8);
        expect(product2.stock).toBe(4);
    });
});
