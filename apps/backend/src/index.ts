import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/user.routes";
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
// La función userRoutes espera (userFinder, uowFactory, authService).
app.use("/users", userRoutes(persistence, persistence, authService));

// La función productRoutes espera (productFinder, uowFactory).
app.use("/products", productRoutes(persistence, persistence));

// La función cartRoutes espera (cartFinder, productFinder, userFinder, uowFactory).
// Pasamos la misma instancia de 'persistence' para todos los roles, ya que la clase PrismaPersistence implementa todas las interfaces necesarias.
app.use("/cart", cartRoutes(persistence, persistence, persistence, persistence));
// El middleware de manejo de errores debe ser el último en registrarse.
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
