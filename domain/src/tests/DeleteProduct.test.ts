import { Product } from "../entities/Product";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { DeleteProduct } from "../use-cases/product/DeleteProduct";
import {
    mockProductFinder,
    mockUowFactory,
    mockUnitOfWork,
    resetMocks
} from './_mocks';

beforeEach(() => {
    resetMocks();
});

describe("DeleteProduct", () => {
    it("should delete a product and commit the unit of work", async () => {
        const existingProduct = Product.create({ name: "Product to delete", description: "desc", price: 10, stock: 10, imageUrl: 'url', createdAt: new Date() }, new UniqueEntityID("prod-1"));
        mockProductFinder.findProductById.mockResolvedValue(existingProduct);
        const deleteProduct = new DeleteProduct(mockProductFinder, mockUowFactory);

        await deleteProduct.execute("prod-1");

        expect(mockUnitOfWork.products.delete).toHaveBeenCalledWith(existingProduct);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});