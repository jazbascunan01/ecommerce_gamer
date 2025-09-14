import { Product } from "../entities/Product";
import { CreateProduct } from "../use-cases/CreateProduct";
import { ListProducts } from "../use-cases/ListProducts";

describe("ListProducts", () => {
    let products: Product[];
    let createProduct: CreateProduct;
    let listProducts: ListProducts;

    beforeEach(() => {
        products = [];
        createProduct = new CreateProduct(products);
        listProducts = new ListProducts(products);
    });

    it("should return an empty array if no products", () => {
        const result = listProducts.execute();
        expect(result).toEqual([]);
    });

    it("should return all created products", () => {
        createProduct.execute("Mouse Gamer", "RGB 16000 DPI", 5999, 10);
        createProduct.execute("Teclado Mecánico", "Switches rojos", 8999, 5);

        const result = listProducts.execute();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe("Mouse Gamer");
        expect(result[1].name).toBe("Teclado Mecánico");
    });
});
