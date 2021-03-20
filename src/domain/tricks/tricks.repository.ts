import Trick from '../../entities/trick-entity';
import { CreateTrickDto, TrickDto } from './tricks.types';

class TrickRepository {
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

export default TrickRepository;
