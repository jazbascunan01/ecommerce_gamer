import { Product } from "../entities/Product";
import { ListProducts } from "../use-cases/ListProducts";

// --- Mocking Dependencies ---
const mockProductFinder = {
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ListProducts", () => {
    it("should return an empty array if no products are found", async () => {
        // Arrange
        mockProductFinder.findAllProducts.mockResolvedValue([]);
        const listProducts = new ListProducts(mockProductFinder);

        // Act
        const result = await listProducts.execute();
        
        // Assert
        expect(result).toEqual([]);
    });

    it("should return all products found by the finder", async () => {
        // Arrange
        const productsInDb = [new Product("p1", "Mouse Gamer", "desc", 100, 10, new Date()), new Product("p2", "Teclado", "desc", 200, 5, new Date())];
        mockProductFinder.findAllProducts.mockResolvedValue(productsInDb);
        const listProducts = new ListProducts(mockProductFinder);
        
        // Act
        const result = await listProducts.execute();
        
        // Assert
        expect(result.length).toBe(2);
        expect(result[0].name).toBe("Mouse Gamer"); // Corregido para que coincida con el mock
    });
});
