import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRoutes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
