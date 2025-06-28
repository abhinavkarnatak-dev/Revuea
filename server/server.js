import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import formRoutes from "./routes/form.routes.js";
import responseRoutes from "./routes/response.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://revuea.vercel.app",
      "https://revuea.vercel.app/dashboard",
      "https://revuea.vercel.app/login",
      "https://revuea.vercel.app/signup",
      "https://revuea.vercel.app/verify",
      "https://revuea.vercel.app/user/profile",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/response", responseRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});