import '../loadenv';
import 'reflect-metadata';

import { RegisterRoutes } from './routes-build/routes';
import { UnauthorizedError } from './domain/user/users.errors';
import { ValidateError } from '@tsoa/runtime';
import bodyParser from 'body-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

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
    if (err instanceof Error) {
        console.error(`Caught Error for ${req.path}:`, err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    next();
});

export default app;
