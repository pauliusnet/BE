import Trick from '../../entities/trick-entity';
import { TricksController } from './tricks.controller';
import { useTestDatabase } from '../../test-support/database-helpers';
import TrickBuilder from '../../test-data/trick-builder';
import { EntityNotFoundError } from 'typeorm';
import { BadRequest } from '../../common/common.errors';

describe('Tricks API tests', () => {
    useTestDatabase();

    describe('POST /tricks', () => {
        it('should create a trick', async () => {
            const tricksController = new TricksController();
            await tricksController.createTrick({
                videoURL: 'testUrl',
                name: 'testName',
                level: 1,
            });

            expect(tricksController.getStatus()).toBe(201);
            const createdTrick = await Trick.findOne();
            expect(createdTrick).toMatchObject({
                videoURL: 'testUrl',
                name: 'testName',
                level: 1,
            });
        });
    });

    describe('GET /tricks', () => {
        it('should find all tricks', async () => {
            const trick = new TrickBuilder().build();
            await trick.save();

            const actual = await new TricksController().getTricks();

            expect(actual).toEqual([{ name: trick.name, level: trick.level, videoURL: trick.videoURL, id: trick.id }]);
        });
    });

    describe('DELETE /tricks/{id}', () => {
        it('should delete a specific trick by id', async () => {
            const trick = new TrickBuilder().build();
            await trick.save();

            await new TricksController().deleteTrickById(trick.id);

            await expect(Trick.findOneOrFail(trick.id)).rejects.toThrow(EntityNotFoundError);
        });

        it('should throw BadRequest error if provided id does not exist', async () => {
            const trick = new TrickBuilder().build();
            await trick.save();

            await expect(new TricksController().deleteTrickById(654654)).rejects.toThrow(BadRequest);
        });
    });

    describe('PATCH /tricks/{id}', () => {
        it('should update a specific trick by id', async () => {
            const trick = new TrickBuilder().build();
            await trick.save();
            const updatedTrick = { name: 'updatedTrick', level: 6, videoURL: 'new' };

            const actual = await new TricksController().updateTrickById(trick.id, updatedTrick);

            expect(actual).toEqual({ ...updatedTrick, id: trick.id });
        });

        it('should throw BadRequest error if provided id does not exist', async () => {
            const trick = new TrickBuilder().build();
            await trick.save();
            const updatedTrick = { name: 'updatedTrick', level: 6, videoURL: 'new' };

            await expect(new TricksController().updateTrickById(546546, updatedTrick)).rejects.toThrow(BadRequest);
        });
    });
});
