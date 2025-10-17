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
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const authService = new AuthService();
const persistence = new PrismaPersistence();

app.use("/api/auth", userRoutes(persistence, persistence, authService));
app.use("/api/products", productRoutes(persistence, persistence, persistence)); // Pasamos las dependencias correctas
app.use("/api/cart", cartRoutes(persistence, persistence, persistence, persistence));

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
