import express from 'express';
import leaderboardRoutes from './routes/leaderboard';
import userRoutes from './routes/user';
import 'dotenv/config';

const app = express();

app.use('/leaderboard', leaderboardRoutes);
app.use('/userDetails', userRoutes);

export default app;
