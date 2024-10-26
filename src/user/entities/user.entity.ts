import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enum/UserType.enum';
import { Course } from 'src/courses/entities/course.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
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
    description:
      'Nombre y apellido del usuario. Es de tipo varchar y no tiene restricciones de longitud. Este campo es obligatorio (no puede ser nulo).',
    example: 'Jonh',
  })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({
    description:
      'Email del usuario. Es de tipo varchar y no tiene restricciones de longitud. Este campo es obligatorio y único (no puede ser nulo).',
    example: 'jonhdoe@mail.com',
  })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description:
      'Contraseña del usuario. Es de tipo varchar y no tiene restricciones de longitud. Este campo es obligatorio (no puede ser nulo).',
    example: 'Contraseña!123',
  })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description:
      'Número de teléfono del usuario. Es de tipo varchar y no tiene restricciones de longitud. (no puede ser nulo)',
    example: '2634123567',
  })
  phone: string;

  /*   @Column({ type: 'date', nullable: false })
  birthdate: Date; */

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description:
      'Dirección del usuario. Es de tipo varchar, donde se almacena la información completa de la dirección. (no puede ser nulo).',
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
  typeUser?: UserType;

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
    description:
      'Indica si el usuario está activo o dado de baja (soft delete).',
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

  @OneToOne(() => Subscription, (subscription) => subscription.id, {
    cascade: true,
  })
  @ApiProperty({
    type: Subscription,
    description: 'Suscripción asociada al usuario.',
  })
  Subscription: Subscription[];
}
