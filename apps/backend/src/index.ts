import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/user.routes";
import { productRoutes } from "./routes/productRoutes";
import { cartRoutes } from "./routes/cartRoutes";

import {PrismaPersistence} from "./persistence/PrismaPersistence";
import {AuthService} from "@domain/services/AuthService";



const app = express();
app.use(cors());
app.use(bodyParser.json());

const authService = new AuthService();
const persistence = new PrismaPersistence();
// Rutas
app.use("/users", userRoutes(persistence, persistence, authService));

// La función productRoutes espera un IProductFinder y un IUnitOfWorkFactory
// (Asumiendo que refactorizaste productRoutes de manera similar)
// app.use("/products", productRoutes(persistence, persistence));

// La función cartRoutes espera un ICartFinder, IProductFinder, IUserFinder y un IUnitOfWorkFactory
// Le pasamos la misma instancia de 'persistence' para todos los roles que cumple.
app.use("/cart", cartRoutes(persistence, persistence, persistence, persistence));
app.use("/products", productRoutes(persistence, persistence));


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
