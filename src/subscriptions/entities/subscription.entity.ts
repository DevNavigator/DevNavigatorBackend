import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from 'src/SuscriptionType/entities/subscriptionType.entity';
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
      'ID de la suscripción. Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad576',
  })
  id: string;

  @OneToOne(() => User, (user) => user.Subscription)
  @ApiProperty({
    description: 'Usuario vinculado a la suscripción.',
    type: () => User,
  })
  @JoinColumn()
  User: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de la creación de la suscripción.',
    example: '2024-01-01T00:00:00.000Z',
  })
  start_sub: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de la finalización de la suscripción.',
    example: '2024-01-01T00:00:00.000Z',
  })
  end_sub: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiProperty({
    description: 'Indica si la suscripción está activa o dada de baja.',
    example: true,
  })
  status_sub: boolean;

  @OneToOne(() => SubscriptionType, { cascade: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Tipos de suscripciónes asociadas.',
    type: SubscriptionType,
  })
  subscriptionType: SubscriptionType; // Relación con la nueva entidad
}
