import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import authorRoutes from "./routes/author.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/transactions", transactionRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
