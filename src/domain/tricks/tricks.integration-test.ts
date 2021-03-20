import { useTestDatabase } from '../../test-support/database-helpers';
import Trick from '../../entities/trick-entity';
import { TricksController } from './tricks.controller';

describe('Tricks API tests', () => {
    useTestDatabase();

    it('should create a trick', async () => {
        const controller = new TricksController();

        await controller.createTrick({
            videoURL: 'testUrl',
            name: 'testName',
            level: 1,
        });

        expect(controller.getStatus()).toBe(201);
        const createdTrick = (await Trick.find())[0];
        expect(createdTrick).toMatchObject({
            videoURL: 'testUrl',
            name: 'testName',
            level: 1,
        });
    });

    it('should get all tricks', async () => {
        const trick = new Trick();
        trick.name = 'name';
        trick.level = 1;
        trick.videoURL = 'videoUrl';
        await trick.save();

        const actual = await new TricksController().getTricks();

        expect(actual).toEqual([{ name: trick.name, level: trick.level, videoURL: trick.videoURL, id: trick.id }]);
    });
});
