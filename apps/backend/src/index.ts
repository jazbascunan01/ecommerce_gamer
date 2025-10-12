import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRoutes";
import { cartRoutes } from "./routes/cartRoutes";
import { errorHandler } from './middlewares/errorHandler';
import {PrismaPersistence} from "./persistence/PrismaPersistence";
import {AuthService} from "@domain/services/AuthService";



const app = express();
app.use(cors());
app.use(bodyParser.json());

const authService = new AuthService();
const persistence = new PrismaPersistence();
// Rutas

// --- Rutas ---
// Las rutas de autenticación no necesitan middleware de autenticación
app.use("/api/auth", userRoutes(persistence, persistence, authService));
// Las rutas de productos y carrito sí necesitan el middleware
app.use("/api/products", productRoutes(persistence, persistence));
app.use("/api/cart", cartRoutes(persistence, persistence, persistence, persistence));

// El middleware de manejo de errores debe ser el último en registrarse.
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
