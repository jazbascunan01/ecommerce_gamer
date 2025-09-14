import { Product } from "../entities/Product";
import { CreateProduct } from "../use-cases/CreateProduct";

describe("CreateProduct", () => {
    let products: Product[];
    let createProduct: CreateProduct;

    beforeEach(() => {
        products = [];
        createProduct = new CreateProduct(products);
    });

    it("should create a new product and add it to the products array", () => {
        const product = createProduct.execute("Mouse Gamer", "Mouse RGB 16000 DPI", 5999, 10);
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Mouse Gamer");
        expect(products.length).toBe(1);
    });
});
