import { Router } from 'express';
import { createTrick, getAllTricks } from './tricks.service';

const trickRouter = Router();

trickRouter.post('/', async (req, res) => {
    await createTrick(req.body);
    res.send();
});

trickRouter.get('/', async (req, res) => {
    try {
        res.send(await getAllTricks());
    } catch (error) {
        res.send(error);
    }
});

export default trickRouter;
