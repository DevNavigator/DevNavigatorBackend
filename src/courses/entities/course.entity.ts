import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { difficulty } from '../enum/difficulty.enum';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    default: 'https://res.cloudinary.com/dckxhsgw0/image/upload/v1729407008/xoaei3fnegkbngnbkshi.jpg'
  })
  image_url?: string;

  @Column({
    type: 'enum',
    enum: difficulty,
    nullable: false,
  })
  difficulty: difficulty;

  @Column({
    type: 'integer',
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  instructor: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_free: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  status_courses: boolean;

  @ManyToMany(() => User, (user) => user.id, { cascade: true })
  Users: User[];

  @ManyToMany(() => Exercise, (exercise) => exercise.id, { cascade: true })
  Exercise: Exercise[];
}
