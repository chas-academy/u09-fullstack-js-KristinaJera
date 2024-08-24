import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './src/config/db.js';


dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

//MongoDb Connection
connectDB();

app.use(cors());
app.use(express.json());

// Use error handling middleware
// app.use(errorHandler);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Job Seeking App API!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
