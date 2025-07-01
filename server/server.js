import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import formRoutes from "./routes/form.routes.js";
import responseRoutes from "./routes/response.routes.js";
import userRoutes from "./routes/user.routes.js";
import pingRoutes from "./routes/ping.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/response", responseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ping", pingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});