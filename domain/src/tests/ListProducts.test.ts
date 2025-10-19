import { Product } from "../entities/Product";
import { ListProducts } from "../use-cases";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { mockProductFinder, resetMocks } from './_mocks';

beforeEach(() => {
    resetMocks();
});

describe("ListProducts", () => {
    it("should return an empty array if no products are found", async () => {
        mockProductFinder.findAllProducts.mockResolvedValue([]);
        const listProducts = new ListProducts(mockProductFinder);
        const result = await listProducts.execute();
        expect(result).toEqual([]);
    });

    it("should return all products found by the finder", async () => {
        const productsInDb = [
            Product.create({
                name: "Mouse Gamer", description: "desc", price: 100, stock: 10, imageUrl: 'url1', createdAt: new Date()
            }, new UniqueEntityID("p1")),
            Product.create({
                name: "Teclado", description: "desc", price: 200, stock: 5, imageUrl: 'url2', createdAt: new Date()
            }, new UniqueEntityID("p2"))
        ];
        mockProductFinder.findAllProducts.mockResolvedValue(productsInDb);
        const listProducts = new ListProducts(mockProductFinder);
        const result = await listProducts.execute();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe("Mouse Gamer");
    });
});
