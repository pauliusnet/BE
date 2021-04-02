import FacebookClient from './facebook-client';
import { InvalidFacebookAccessToken } from './facebook-client.errors';
import axios from 'axios';

describe('Facebook client', () => {
    describe('#validateAccessToken', () => {
        it('should throw an unauthorized error if facebook API rejects with 400 status code', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue({ response: { status: 400 } });

            await expect(new FacebookClient().validateAccessToken('invalid')).rejects.toThrow(
                InvalidFacebookAccessToken
            );
        });

        it('should throw general error if any other error occurs', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(new Error());

            await expect(new FacebookClient().validateAccessToken('valid')).rejects.toThrow(Error);
            await expect(new FacebookClient().validateAccessToken('valid')).rejects.not.toThrow(
                InvalidFacebookAccessToken
            );
        });

        it('should throw Unauthorized error if facebook app id does not match', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: 'differentAppId' } });

            await expect(new FacebookClient().validateAccessToken('valid')).rejects.toThrow(InvalidFacebookAccessToken);
        });

        it('should resolve if fetched facebook app id matches', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: process.env.APP_ID } });

            await expect(new FacebookClient().validateAccessToken('valid')).resolves.not.toThrow();
        });
    });

    describe('#getUserDetails', () => {
        it('should throw an unauthorized error if facebook API rejects with 400 status code', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue({ response: { status: 400 } });

            await expect(new FacebookClient().getUserDetails('invalid')).rejects.toThrow(InvalidFacebookAccessToken);
        });

        it('should throw general error if any other error occurs', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(new Error());

            await expect(new FacebookClient().getUserDetails('valid')).rejects.toThrow(Error);
            await expect(new FacebookClient().getUserDetails('valid')).rejects.not.toThrow(InvalidFacebookAccessToken);
        });

        it('should resolve', async () => {
            const data = { name: 'test1', email: 'test2', picture: { data: { url: 'url' } } };
            jest.spyOn(axios, 'get').mockResolvedValue({ data });

            const actual = await new FacebookClient().getUserDetails('valid');

            expect(actual).toEqual({ name: data.name, email: data.email, pictureURL: data.picture.data.url });
        });
    });
});
