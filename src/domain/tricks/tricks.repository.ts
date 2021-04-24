import { CreateTrickDto, TrickDto, UpdateTrickDto } from './tricks.types';

import Trick from '../../entities/trick-entity';
import { EntityNotFoundError } from 'typeorm';
import { TrickDoesNotExist } from './tricks.repository.errors';

class TricksRepository {
    async createTrick(trickBody: CreateTrickDto): Promise<void> {
        const trick = new Trick();
        trick.level = trickBody.level;
        trick.name = trickBody.name;
        trick.videoURL = trickBody.videoURL;
        await trick.save();
    }

    async getAllTricks(): Promise<TrickDto[]> {
        return await Trick.find();
    }

    async deleteTrickById(id: number): Promise<void> {
        const trick = await this.findTrickById(id);
        await trick.remove();
    }

    async updateTrickById(id: number, updatedTrick: UpdateTrickDto): Promise<TrickDto> {
        const trick = await this.findTrickById(id);
        trick.name = updatedTrick.name;
        trick.level = updatedTrick.level;
        trick.videoURL = updatedTrick.videoURL;
        await trick.save();

        return trick;
    }

    private async findTrickById(id: number): Promise<Trick> {
        try {
            return await Trick.findOneOrFail(id);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new TrickDoesNotExist(`Trick with id: ${id} does not exist`);
            }
            throw error;
        }
    }
}

export default TricksRepository;
