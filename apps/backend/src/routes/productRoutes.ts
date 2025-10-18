import { Router } from "express";
import { IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createProductController } from "../controllers/product.controller";
import { createAuthMiddleware } from "../middlewares/auth";
import { adminAuth } from "../middlewares/adminAuth";


export const productRoutes = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory,
    userFinder: IUserFinder
) => {
    const router = Router();
    const productController = createProductController(productFinder, unitOfWorkFactory);
    const authMiddleware = createAuthMiddleware(userFinder);

    /**
     * @swagger
     * tags:
     *   name: Products
     *   description: Endpoints para la gestión de productos
     */

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Obtiene una lista de todos los productos
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: Una lista de productos.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Product'
     */
    router.get("/", productController.listProducts);

    /**
     * @swagger
     * /api/products/summary/stats:
     *   get:
     *     summary: Obtiene estadísticas de los productos (Solo Admin)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas de productos.
     *       401:
     *         description: No autorizado.
     *       403:
     *         description: Acceso denegado.
     */
    router.get("/summary/stats", authMiddleware, adminAuth, productController.getProductStats);

    /**
     * @swagger
     * /api/products/{id}:
     *   get:
     *     summary: Obtiene un producto por su ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: El ID del producto.
     *     responses:
     *       200:
     *         description: Detalles del producto.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       404:
     *         description: Producto no encontrado.
     */
    router.get("/:id", productController.findProductById);

    /**
     * @swagger
     * /api/products:
     *   post:
     *     summary: Crea un nuevo producto (Solo Admin)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               stock:
     *                 type: integer
     *               imageUrl:
     *                 type: string
     *     responses:
     *       201:
     *         description: Producto creado exitosamente.
     *       401:
     *         description: No autorizado.
     *       403:
     *         description: Acceso denegado.
     */
    router.post("/", authMiddleware, adminAuth, productController.createProduct);

    /**
     * @swagger
     * /api/products/{id}:
     *   put:
     *     summary: Actualiza un producto existente (Solo Admin)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: El ID del producto a actualizar.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       200:
     *         description: Producto actualizado.
     *       401:
     *         description: No autorizado.
     *       403:
     *         description: Acceso denegado.
     *       404:
     *         description: Producto no encontrado.
     */
    router.put("/:id", authMiddleware, adminAuth, productController.updateProduct);

    /**
     * @swagger
     * /api/products/{id}:
     *   delete:
     *     summary: Elimina un producto (Solo Admin)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: El ID del producto a eliminar.
     *     responses:
     *       204:
     *         description: Producto eliminado exitosamente.
     *       401:
     *         description: No autorizado.
     *       403:
     *         description: Acceso denegado.
     */
    router.delete('/:id', authMiddleware, adminAuth, productController.deleteProduct);

    return router;
};
