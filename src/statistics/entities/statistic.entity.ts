// src/statistics/entities/statistics.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Statistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.statistics, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column('json', { nullable: true })
  achievements: Array<{ title: string; date: string }>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
