import Trick from '../../entities/trick-entity';
import TrickRepository from './tricks.repository';
import { TrickRequestBody } from './tricks.types';

export const createTrick = async (trickBody: TrickRequestBody): Promise<void> => {
    await new TrickRepository().createTrick(trickBody);
};

export const getAllTricks = async (): Promise<Trick[]> => {
    return await new TrickRepository().getAllTricks();
};
