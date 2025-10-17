import { Product } from "../../entities/Product";
import { IProductFinder } from "../../services/IPersistence";

export interface ProductStats {
    totalProducts: number;
    totalStock: number;
    totalStockValue: number;
    productsOutOfStock: number;
    averageProductPrice: number;
    highestStockProduct: { name: string; stock: number } | null;
}

export class GetProductStats {
    constructor(private readonly productFinder: IProductFinder) {}

    async execute(): Promise<ProductStats> {
        const products = await this.productFinder.findAllProducts();

        if (products.length === 0) {
            return {
                totalProducts: 0,
                totalStock: 0,
                totalStockValue: 0,
                productsOutOfStock: 0,
                averageProductPrice: 0,
                highestStockProduct: null,
            };
        }

        const initialAccumulator = {
            totalStock: 0,
            totalStockValue: 0,
            productsOutOfStock: 0,
            highestStockProduct: null as Product | null,
        };

        const intermediateStats = products.reduce(
            (acc, product) => {
                acc.totalStock += product.stock;
                acc.totalStockValue += product.stock * product.price;
                if (product.stock === 0) {
                    acc.productsOutOfStock += 1;
                }
                if (!acc.highestStockProduct || product.stock > acc.highestStockProduct.stock) {
                    acc.highestStockProduct = product;
                }
                return acc;
            },
            initialAccumulator
        );

        const totalValueAllProducts = products.reduce((sum, p) => sum + p.price, 0);

        return {
            totalProducts: products.length,
            ...intermediateStats,
            averageProductPrice: products.length > 0 ? totalValueAllProducts / products.length : 0,
            highestStockProduct: intermediateStats.highestStockProduct ? { name: intermediateStats.highestStockProduct.name, stock: intermediateStats.highestStockProduct.stock } : null,
        };
    }
}