import Trick from '../../entities/trick-entity';
import { TricksController } from './tricks.controller';
import { useTestDatabase } from '../../test-support/database-helpers';
import TrickBuilder from '../../test-data/trick-builder';

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
        const createdTrick = await Trick.findOne();
        expect(createdTrick).toMatchObject({
            videoURL: 'testUrl',
            name: 'testName',
            level: 1,
        });
    });

    it('should get all tricks', async () => {
        const trick = new TrickBuilder().build();
        await trick.save();

        const actual = await new TricksController().getTricks();

        expect(actual).toEqual([{ name: trick.name, level: trick.level, videoURL: trick.videoURL, id: trick.id }]);
    });
});
