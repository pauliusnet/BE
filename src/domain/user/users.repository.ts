import { ChangeUserRoleDto, GetUserDto, UserInfoDto } from './users.types';

import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import Role from '../../entities/role-entity';
import User from '../../entities/user-entity';
import { RoleDoesNotExist, UserDoesNotExist } from './users.repository.errors';
import { UserRole } from '../../entities/role-entity.types';

class UsersRepository {
    async createUser(userInfo: UserInfoDto): Promise<void> {
        const user = new User();
        user.name = userInfo.name;
        user.email = userInfo.email;
        user.pictureURL = userInfo.pictureURL;

        const role = await this.findRoleByType(UserRole.Customer);
        user.role = role;

        await user.save();
    }

    async updateUser(userInfo: UserInfoDto): Promise<void> {
        const user = await this.findUserByEmail(userInfo.email);
        user.name = userInfo.name;
        user.pictureURL = userInfo.pictureURL;
        await user.save();
    }

    async getUser(email: string): Promise<GetUserDto> {
        const user = await this.findUserByEmail(email, ['role']);
        return {
            id: user.id,
            email: user.email,
            pictureURL: user.pictureURL,
            name: user.name,
            role: user.role.type,
        };
    }

    async changeUserRole(changeUserRoleDto: ChangeUserRoleDto): Promise<void> {
        const user = await this.findUserByEmail(changeUserRoleDto.email, ['role']);
        user.role = await this.findRoleByType(changeUserRoleDto.role);
        await user.save();
    }

    private async findUserByEmail(email: string, relations: string[] = []): Promise<User> {
        try {
            return await User.findOneOrFail({ email: email }, { relations });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new UserDoesNotExist(`User with email: ${email} does not exist`);
            }
            throw error;
        }
    }

    private async findRoleByType(type: UserRole): Promise<Role> {
        try {
            return await Role.findOneOrFail({ type });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new RoleDoesNotExist(`Role with type: ${type} does not match any role enum type`);
            }
            throw error;
        }
    }
}

export default UsersRepository;
