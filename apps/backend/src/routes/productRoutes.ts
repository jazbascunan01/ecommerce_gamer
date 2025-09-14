import { Router } from "express";
import { Product } from "@domain/entities/Product";
import { CreateProduct } from "@domain/use-cases/CreateProduct";
import { ListProducts } from "@domain/use-cases/ListProducts";

const router = Router();
const products: Product[] = [];
const createProduct = new CreateProduct(products);
const listProducts = new ListProducts(products);

// Crear producto
router.post("/", (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const product = createProduct.execute(name, description, price, stock);
        res.json(product);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Listar productos
router.get("/", (req, res) => {
    const result = listProducts.execute();
    res.json(result);
});

export { router as productRoutes };
