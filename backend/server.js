import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './src/config/db.js';
import router from "./src/routes/index.js";
import errorMiddleware from './src/middlewares/errorMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

//MongoDb Connection
connectDB();

// app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from your frontend server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.use('/api-v1/auth', authRoutes);
// app.use((req, res, next) => {
//   console.log(`[server]: ${req.method} ${req.url} hit`);
//   next();
// });


// Use error handling middleware
app.use(errorMiddleware);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Job Seeking App API!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
