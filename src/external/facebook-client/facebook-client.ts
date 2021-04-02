import { FacebookApplicationDetails, UserDetails } from './facebook-client.types';

import { InvalidFacebookAccessToken } from './facebook-client.errors';
import axios from 'axios';

class FacebookClient {
    async validateAccessToken(accessToken: string): Promise<void> {
        const facebookApplicationDetails = await this.getFacebookApplicationDetails(accessToken);
        if (facebookApplicationDetails.data.id !== process.env.APP_ID) {
            throw new InvalidFacebookAccessToken('Facebook App Id mismatch error');
        }
    }

    private async getFacebookApplicationDetails(accessToken: string): Promise<FacebookApplicationDetails> {
        try {
            return await axios.get(`https://graph.facebook.com/app/?access_token=${accessToken}`);
        } catch (error) {
            if (error.response?.status === 400) {
                throw new InvalidFacebookAccessToken('Facebook App authentication failed');
            }
            throw error;
        }
    }

    async getUserDetails(accessToken: string): Promise<UserDetails> {
        try {
            const userDetails = await axios.get(
                `https://graph.facebook.com/me?fields=email,name,picture&access_token=${accessToken}`
            );
            return {
                name: userDetails.data.name,
                pictureURL: userDetails.data.picture.data.url,
                email: userDetails.data.email,
            };
        } catch (error) {
            if (error.response?.status === 400) {
                throw new InvalidFacebookAccessToken('Unauthorized to fetch facebook user details');
            }
            throw error;
        }
    }
}

export default FacebookClient;
