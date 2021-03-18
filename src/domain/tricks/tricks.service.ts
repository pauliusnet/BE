import TrickRepository from './tricks.repository';
import { TrickRequestBody } from './tricks.types';

const createTrick = async (trickBody: TrickRequestBody): Promise<void> => {
    await new TrickRepository().createTrick(trickBody);
};

export default createTrick;
