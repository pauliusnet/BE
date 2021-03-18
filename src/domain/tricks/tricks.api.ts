import { Router } from 'express';
import createTrick from './tricks.service';

const trickRouter = Router();

trickRouter.post('/', async (req, res) => {
    await createTrick(req.body);
    res.send();
});

export default trickRouter;
