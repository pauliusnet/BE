import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import User from './user-entity';
import { UserRole } from './role-entity.types';

@Entity()
class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    type: UserRole;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}

export default Role;
