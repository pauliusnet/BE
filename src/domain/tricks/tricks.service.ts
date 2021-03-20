import TrickRepository from './tricks.repository';
import { CreateTrickDto, TrickDto } from './tricks.types';

class TricksService {
    async createTrick(trickBody: CreateTrickDto): Promise<void> {
        await new TrickRepository().createTrick(trickBody);
    }

    async getAllTricks(): Promise<TrickDto[]> {
        return await new TrickRepository().getAllTricks();
    }
}

export default TricksService;
