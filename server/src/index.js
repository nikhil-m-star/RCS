import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import projectRoutes from './routes/projects.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RCS Backend is running' });
});

// Project Routes
app.use('/api/projects', projectRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
