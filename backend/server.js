import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobsRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companiesRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

const whitelist = [
  "https://jseekingappp.netlify.app/",
  "http://localhost:5173/"
]
const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
// Use the routes
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api-v1/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", companyRoutes);
app.use("/api", messageRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
// Use error handling middleware
app.use(errorMiddleware);

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Job Seeking App API!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
