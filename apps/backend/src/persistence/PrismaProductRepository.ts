import { Product } from "@domain/entities/Product";
import { IProductFinder } from "@domain/services/IPersistence";
import prisma from "../prisma-client";
import { UniqueEntityID } from "@domain/core/UniqueEntityID";

export class PrismaProductRepository implements IProductFinder {
    async findProductById(id: string): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return null;
        try {
            return Product.create({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt
            }, new UniqueEntityID(product.id));
        } catch (error: any) {
            console.error(`Data integrity issue for product ${product.id}: ${error.message}`);
            throw new Error(`Failed to map database data to Product entity for product ID ${product.id}.`);
        }
    }

    async findAllProducts(): Promise<Product[]> {
        const productsData = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return productsData.map(p => {
            try {
                return Product.create({
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    imageUrl: p.imageUrl,
                    createdAt: p.createdAt
                }, new UniqueEntityID(p.id));
            } catch (error: any) {
                console.error(`Skipping product with ID ${p.id} due to data integrity issue: ${error.message}`);
                return null;
            }
        }).filter((p): p is Product => p !== null);
    }
}