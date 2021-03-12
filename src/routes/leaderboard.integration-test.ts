import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

describe('GET /leaderboard endpoint', () => {
    it('should resolve succesfully', async () => {
        await request
            .get('/leaderboard')
            .expect(200)
            .expect({
                top10: [
                    { name: 'Rokas', points: '417', img: 'N/A' },
                    { name: 'Rokas', points: '417', img: 'N/A' },
                    { name: 'Rokas', points: '417', img: 'N/A' },
                    { name: 'Rokas', points: '417', img: 'N/A' },
                    { name: 'Rokas', points: '417', img: 'N/A' },
                ],
            });
    });
});
