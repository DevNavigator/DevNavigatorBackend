import { Exercise } from 'src/exercises/entities/exercise.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { difficulty } from '../enum/difficulty.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID del curso.Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad571',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @ApiProperty({
    description:
      'Titulo del curso. Es de tipo varchar, tiene una longitud maxima de 100 caracteres y no puede ser nulo.',
    example: 'Programacion con Java',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @ApiProperty({
    description:
      'Tipo del curso. Es de tipo varchar, tiene una longitud maxima de 50 caracteres y no puede ser nulo.',
    example: 'Backend',
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @ApiProperty({
    description:
      'Descripcion del curso. Es de tipo varchar, tiene una longitud maxima de 255 caracteres y no puede ser nulo',
    example: 'Curso de backend con Java y Spring Boot',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: difficulty,
    nullable: false,
  })
  @ApiProperty({
    description: 'Dificultad del curso. No puede ser nulo.',
    enum: difficulty,
    enumName: 'difficulty',
  })
  difficulty: difficulty;

  @Column({ type: 'varchar', nullable: false })
  requirements: string;

  @Column({ type: 'varchar', nullable: false })
  format: string;

  @Column({ type: 'boolean', nullable: false })
  includes_exercises: boolean;

  @Column({ type: 'varchar', nullable: false })
  objetives: string;

  @Column({ type: 'varchar', nullable: false })
  learn: string;

  @Column({
    type: 'simple-json', // Usa simple-json para almacenar un array de objetos.
    nullable: true, // Puede ser opcional.
  })
  @ApiProperty({
    description:
      'Contenido del curso, que incluye un título y una URL. Se almacena como un array de objetos JSON.',
    example: [
      {
        title: 'Introducción a JavaScript',
        url: 'http://contenido-del-curso.com',
      },
    ],
    isArray: true,
  })
  content: { title: string; url: string }[];

  @Column({ type: 'simple-json', nullable: false })
  questions: Array<{ question: string; options: string[]; correct: number }>;

  @Column({
    type: 'varchar',
    default:
      'https://res.cloudinary.com/dckxhsgw0/image/upload/v1729623569/lpsekc5dxicsi0mhtmqr.png',
    nullable: false,
  })
  @ApiProperty({
    description:
      'Imagen del curso. Es de tipo varchar, tiene una longitud maxima de 255 caracteres y no puede ser nulo.',
    example: 'http://devnavigator.com/image/98179857',
  })
  image_url: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @ApiProperty({
    description: 'Duracion del curso. No puede ser nulo.',
    example: '120 hs',
  })
  duration: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @ApiProperty({
    description: 'Nombre del instructor del curso. No puede ser nulo.',
    example: 'Rodrigo Chavez',
  })
  instructor: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiProperty({
    description:
      'Indica si el curso es gratuito o es pago. No puede ser nulo. Por defecto es falso.',
    example: false,
  })
  is_free: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Fecha de creacion del curso.',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Fecha de actualizacion del curso.',
    example: '2024-01-20T00:00:00.000Z',
  })
  updated_at: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  @ApiProperty({
    description: 'Estado del curso. Puede ser true o false.',
    example: true,
  })
  status_courses: boolean;

  @ManyToMany(() => User, (user) => user.id, { cascade: true })
  @ApiProperty({
    type: () => [User],
    description: 'Usuarios asociados a los cursos.',
    isArray: true,
  })
  Users: User[];

  @ManyToMany(() => Exercise, (exercise) => exercise.id, { cascade: true })
  @ApiProperty({
    type: () => [Exercise],
    description: 'Ejercicios asociados a los cursos.',
    isArray: true,
  })
  Exercise: Exercise[];
}
