import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './src/config/db.js';
import router from "./src/routes/index.js";
import errorMiddleware from './src/middlewares/errorMiddleware.js';

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

//MongoDb Connection
connectDB();

app.use(cors());
app.use(express.json());
app.use(router);

// Use error handling middleware
app.use(errorMiddleware);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Job Seeking App API!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
