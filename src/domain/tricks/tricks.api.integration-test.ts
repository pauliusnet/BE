import supertest from 'supertest';
import { useTestDatabase } from '../../test-support/database-helpers';
import app from '../../app';
import Trick from '../../entities/trick-entity';

const request = supertest(app);

describe('Tricks API tests', () => {
    useTestDatabase();

    it('should create a trick', async () => {
        await request
            .post('/tricks')
            .send({
                videoURL: 'testUrl',
                name: 'testName',
                level: 1,
            })
            .expect(200);

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
        await request
            .get('/tricks')
            .expect([{ name: trick.name, level: trick.level, videoURL: trick.videoURL, id: trick.id }]);
    });
});
