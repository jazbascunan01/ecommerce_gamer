import { CreateProduct } from "../use-cases/CreateProduct";

// --- Mocking Dependencies ---
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

describe("CreateProduct", () => {
    it("should create a new product and save it via Unit of Work", async () => {
        // Arrange
        const createProduct = new CreateProduct(mockUowFactory);
        
        // Act
        const product = await createProduct.execute("Mouse Gamer", "Mouse RGB 16000 DPI", 5999, 10, "url-de-imagen.jpg");
        
        // Assert
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Mouse Gamer");
        expect(mockUnitOfWork.products.save).toHaveBeenCalledWith(product);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});
