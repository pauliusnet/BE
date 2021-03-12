import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

describe('GET /userDetails endpoint', () => {
    it('should return resolve successfully', async () => {
        await request.get('/userDetails').expect(200).expect({ name: 'Arnas' });
    });
});
