import express from 'express';
import leaderboardRoutes from './routes/leaderboard';
import userRoutes from './routes/user';
import 'dotenv/config';

const app = express();

//Define routes
app.use('/leaderboard', leaderboardRoutes);
app.use('/userDetails', userRoutes);

//Server start
if (process.env.NODE_ENV != 'test') {
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running on localhost: ${port}`);
    });
}

export default app;
