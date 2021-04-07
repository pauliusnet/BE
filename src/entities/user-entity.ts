import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Role from './role-entity';

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    pictureURL: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;
}

export default User;
