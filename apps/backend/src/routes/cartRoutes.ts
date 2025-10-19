import { Router } from "express";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createCartController } from "../controllers/cart.controller";
import { createAuthMiddleware } from "../middlewares/auth";

export const cartRoutes = (
    cartFinder: ICartFinder,
    productFinder: IProductFinder,
    userFinder: IUserFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const router = Router();
    const cartController = createCartController(cartFinder, productFinder, unitOfWorkFactory);

    const authMiddleware = createAuthMiddleware(userFinder);
    router.use(authMiddleware);

    /**
     * @swagger
     * tags:
     *   name: Cart
     *   description: Endpoints para la gestión del carrito de compras
     */

    /**
     * @swagger
     * /api/cart:
     *   get:
     *     summary: Obtiene el carrito del usuario actual
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: El carrito del usuario.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cart'
     *       401:
     *         description: No autorizado.
     */
    router.get("/", cartController.getCart);

    /**
     * @swagger
     * /api/cart/items:
     *   post:
     *     summary: Añade un producto al carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               productId:
     *                 type: string
     *               quantity:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Producto añadido al carrito.
     *       401:
     *         description: No autorizado.
     *       404:
     *         description: Producto no encontrado.
     */
    router.post("/items", cartController.addProductToCart);

    /**
     * @swagger
     * /api/cart/items/{productId}:
     *   delete:
     *     summary: Elimina un producto del carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: string
     *         required: true
     *         description: El ID del producto a eliminar.
     *     responses:
     *       200:
     *         description: Producto eliminado del carrito.
     *       401:
     *         description: No autorizado.
     */
    router.delete("/items/:productId", cartController.removeProductFromCart);

    /**
     * @swagger
     * /api/cart/items/{productId}:
     *   patch:
     *     summary: Actualiza la cantidad de un producto en el carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: productId
     *         schema:
     *           type: string
     *         required: true
     *         description: El ID del producto a actualizar.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               quantity:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Cantidad actualizada.
     *       401:
     *         description: No autorizado.
     */
    router.patch("/items/:productId", cartController.updateCartItem);

    /**
     * @swagger
     * /api/cart/clear:
     *   post:
     *     summary: Vacía el carrito de compras
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Carrito vaciado.
     *       401:
     *         description: No autorizado.
     */
    router.post("/clear", cartController.clearCart);

    return router;
};