import { CreateTrickDto, TrickDto } from './tricks.types';

import TricksRepository from './tricks.repository';

class TricksService {
    tricksRepository = new TricksRepository();

    async createTrick(trickBody: CreateTrickDto): Promise<void> {
        await this.tricksRepository.createTrick(trickBody);
    }

    async getAllTricks(): Promise<TrickDto[]> {
        return await this.tricksRepository.getAllTricks();
    }
}

export default TricksService;
