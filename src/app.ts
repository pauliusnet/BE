import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import 'reflect-metadata';
import leaderboardRoutes from './routes/leaderboard';
import userRoutes from './routes/user';
import trickRouter from './domain/tricks/tricks.api';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/leaderboard', leaderboardRoutes);
app.use('/userDetails', userRoutes);
app.use('/tricks', trickRouter);

export default app;
