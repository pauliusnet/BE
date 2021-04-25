import dotenv from 'dotenv';
import 'reflect-metadata';
import { RegisterRoutes } from './routes-build/routes';
import { UnauthorizedError } from './domain/user/users.errors';
import { ValidateError } from '@tsoa/runtime';
import { BadRequest } from './common/common.errors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
if (process.env.ENVIRONMENT !== 'prod') app.use(express.static(__dirname + '/routes-build'));

app.use('/docs', swaggerUi.serve, async (req, res) =>
    res.send(swaggerUi.generateHTML(await import('./routes-build/swagger.json')))
);

RegisterRoutes(app);

app.use((req, res) => res.status(404).send({ message: 'Not Found' }));

app.use((err, req, res, next) => {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        });
    }
    if (err instanceof UnauthorizedError) {
        console.warn(`Caught Unauthorized Error for ${req.path}:`, err.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (err instanceof BadRequest) {
        console.warn(`Caught BadRequest Error for ${req.path}:`, err.message);
        return res.status(400).json({ message: 'Bad request' });
    }
    if (err instanceof Error) {
        console.error(`Caught Error for ${req.path}:`, err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    next();
});

export default app;
