import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRoutes";
import { cartRoutes } from "./routes/cartRoutes";
import { errorHandler } from './middlewares/errorHandler';
import {PrismaPersistence} from "./persistence/PrismaPersistence";
import { PrismaUserRepository } from "./persistence/PrismaUserRepository";
import { PrismaProductRepository } from "./persistence/PrismaProductRepository";
import { PrismaCartRepository } from "./persistence/PrismaCartRepository";
import {AuthService} from "@domain/services/AuthService";
import { swaggerSpec } from "./swagger";



const app = express();
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authService = new AuthService();

const userRepo = new PrismaUserRepository();
const productRepo = new PrismaProductRepository();
const cartRepo = new PrismaCartRepository();

const uowFactory = new PrismaPersistence();

app.use("/api/auth", userRoutes(userRepo, uowFactory, authService));
app.use("/api/products", productRoutes(productRepo, uowFactory, userRepo));
app.use("/api/cart", cartRoutes(cartRepo, productRepo, userRepo, uowFactory));

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
