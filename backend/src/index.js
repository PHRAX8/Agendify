import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import {connectDB} from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/service", serviceRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});