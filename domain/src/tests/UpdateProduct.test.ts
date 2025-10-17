import { Product } from "../entities/Product";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { UpdateProduct } from "../use-cases/UpdateProduct";
import { ProductNotFoundError } from "../errors/DomainError";
import {
    mockProductFinder,
    mockUowFactory,
    mockUnitOfWork,
    resetMocks
} from './_mocks';

beforeEach(() => {
    resetMocks();
});

describe("UpdateProduct", () => {
    it("should update a product's details and save it", async () => {
        const existingProduct = Product.create({
            name: "Old Name", description: "Old Desc", price: 10, stock: 10, imageUrl: 'old_url', createdAt: new Date()
        }, new UniqueEntityID("prod-1"));
        mockProductFinder.findProductById.mockResolvedValue(existingProduct);
        const updateProduct = new UpdateProduct(mockProductFinder, mockUowFactory);
        const updatedData = { name: "New Name", price: 20 };
        const updatedProduct = await updateProduct.execute("prod-1", updatedData);
        expect(updatedProduct.name).toBe("New Name");
        expect(updatedProduct.price).toBe(20);
        expect(mockUnitOfWork.products.update).toHaveBeenCalledWith(updatedProduct);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });

    it("should throw ProductNotFoundError if product does not exist", async () => {
        mockProductFinder.findProductById.mockResolvedValue(null);
        const updateProduct = new UpdateProduct(mockProductFinder, mockUowFactory);

        try {
            await updateProduct.execute("non-existent-id", { name: "New Name" });
            fail("Expected UpdateProduct.execute to throw an error, but it did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(ProductNotFoundError);
        }
    });
});