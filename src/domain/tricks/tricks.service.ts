import { CreateTrickDto, TrickDto, UpdateTrickDto } from './tricks.types';

import TricksRepository from './tricks.repository';

class TricksService {
    tricksRepository = new TricksRepository();

    async createTrick(trickBody: CreateTrickDto): Promise<void> {
        await this.tricksRepository.createTrick(trickBody);
    }

    async getAllTricks(): Promise<TrickDto[]> {
        return await this.tricksRepository.getAllTricks();
    }

    async deleteTrickById(id: number): Promise<void> {
        return await this.tricksRepository.deleteTrickById(id);
    }

    async updateTrickById(id: number, updatedTrick: UpdateTrickDto): Promise<TrickDto> {
        return await this.tricksRepository.updateTrickById(id, updatedTrick);
    }
}

export default TricksService;
