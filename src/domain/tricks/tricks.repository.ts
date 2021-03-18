import Trick from '../../entities/trick-entity';
import { TrickRequestBody } from './tricks.types';

class TrickRepository {
    async createTrick(trickBody: TrickRequestBody): Promise<void> {
        const trick = new Trick();
        trick.level = trickBody.level;
        trick.name = trickBody.name;
        trick.videoURL = trickBody.videoURL;
        await trick.save();
    }
}

export default TrickRepository;
