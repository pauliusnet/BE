import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Trick extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    videoURL: string;

    @Column()
    level: number;

    @Column()
    name: string;
}

export default Trick;
