import { CreateProduct } from "../use-cases";
import {
    mockUowFactory,
    mockUnitOfWork,
    resetMocks
} from './_mocks';

beforeEach(() => {
    resetMocks();
});

describe("CreateProduct", () => {
    it("should create a new product and save it via Unit of Work", async () => {
        const createProduct = new CreateProduct(mockUowFactory);
        const product = await createProduct.execute("Mouse Gamer", "Mouse RGB 16000 DPI", 5999, 10, "url-de-imagen.jpg");
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Mouse Gamer");
        expect(mockUnitOfWork.products.save).toHaveBeenCalledWith(product);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});
