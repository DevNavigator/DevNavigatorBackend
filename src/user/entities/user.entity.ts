import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enum/UserType.enum';
import { Course } from 'src/courses/entities/course.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Statistics } from 'src/statistics/entities/statistic.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID del usuario de tipo UUID. Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
  })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description: 'Nombre y apellido del usuario.',
    example: 'Jonh Doe',
  })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({
    description: 'Email del usuario.',
    example: 'jonhdoe@mail.com',
  })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description: 'Contraseña del usuario.',
    example: 'Contraseña!123',
  })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    description: 'Número de teléfono del usuario.',
    example: '2634123567',
  })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    description: 'Dirección del usuario.',
    example: '123 Calle Falsa, Departamento 4B',
  })
  address: string;

  @Column({
    type: 'varchar',
    default:
      'https://res.cloudinary.com/dckxhsgw0/image/upload/v1729402649/qznf5erppvbzjovhynbd.png',
  })
  @ApiProperty({
    description: 'Imagen de perfil del usuario.',
    example:
      'https://res.cloudinary.com/dckxhsgw0/image/upload/v1729402642/qznf5erppvbzjovhynbd.png',
  })
  imgProfile?: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.User,
  })
  @ApiProperty({
    enum: UserType,
    description: 'El tipo de usuario que define su rol en la plataforma.',
    default: UserType.User,
    enumName: 'UserType',
  })
  userType?: UserType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de creación del recurso.',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    type: String,
    description: 'Fecha y hora de la última actualización del recurso.',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el usuario está activo o dado de baja.',
    example: true,
  })
  statusUser: boolean;

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable({ name: 'curse_users' })
  @ApiProperty({
    type: [Course],
    description: 'Lista de cursos asociados al usuario.',
  })
  Courses: Course[];

  @OneToOne(() => Subscription, (subscription) => subscription.User, {
    cascade: true,
  })
  @ApiProperty({
    type: Subscription,
    description: 'Suscripción asociada al usuario.',
  })
  Subscription: Subscription;

  @OneToMany(() => Statistics, (statistics) => statistics.user, {
    cascade: true,
  })
  statistics: Statistics[];

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiration: Date;
}
