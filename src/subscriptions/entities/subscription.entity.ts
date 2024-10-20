import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID de la suscripcion. Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad576',
  })
  id: string;

  @OneToOne(() => User, (user) => user.Subscription)
  @JoinColumn()
  @ApiProperty({
    description: 'Usuario vinculado a la suscripcion.',
    example: User,
  })
  User: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de la creacion de la suscripcion.',
    example: '2024-01-01T00:00:00.000Z',
  })
  start_sub: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de la finalizacion de la suscripcion.',
    example: '2024-01-01T00:00:00.000Z',
  })
  end_sub: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiProperty({
    description:
      'Indica si la suscripcion está activa o dada de baja (soft delete).',
    example: true,
  })
  status_sub: boolean;
}
