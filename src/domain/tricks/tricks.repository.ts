import { CreateTrickDto, TrickDto } from './tricks.types';

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
}

export default TricksRepository;
