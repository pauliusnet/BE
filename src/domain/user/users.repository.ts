import { GetUserDto, UserInfoDto } from './users.types';

import { EntityNotFoundError } from 'typeorm';
import User from '../../entities/user-entity';
import { UserDoesNotExist } from './users.repository.errors';

class UsersRepository {
    async createUser(userInfo: UserInfoDto): Promise<void> {
        const user = new User();
        user.name = userInfo.name;
        user.email = userInfo.email;
        user.pictureURL = userInfo.pictureURL;
        await user.save();
    }

    async updateUser(userInfo: UserInfoDto): Promise<void> {
        const user = await User.findOneOrFail({ email: userInfo.email });
        user.name = userInfo.name;
        user.pictureURL = userInfo.pictureURL;
        await user.save();
    }

    async getUser(email: string): Promise<GetUserDto> {
        try {
            const user = await User.findOneOrFail({ email });
            return {
                id: user.id,
                email: user.email,
                pictureURL: user.pictureURL,
                name: user.name,
            };
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new UserDoesNotExist('User does not exist.');
            }
            throw error;
        }
    }
}

export default UsersRepository;
