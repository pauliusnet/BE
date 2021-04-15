import { CreateTrickDto, TrickDto, UpdateTrickDto } from './tricks.types';

import Trick from '../../entities/trick-entity';

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
        await Trick.delete(id);
    }

    async updateTrickById(id: number, updatedTrick: UpdateTrickDto): Promise<TrickDto> {
        const trick = await Trick.findOneOrFail(id);
        trick.name = updatedTrick.name;
        trick.level = updatedTrick.level;
        trick.videoURL = updatedTrick.videoURL;
        await trick.save();

        return trick;
    }
}

export default TricksRepository;
