import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/courses/entities/course.entity';
import { difficulty } from 'src/courses/enum/difficulty.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description:
      'ID del ejercicio. Este valor es autogenerado por la base de datos.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad576',
  })
  id: string;

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable({ name: 'curse_exercise_id' })
  @ApiProperty({
    description: 'Cursos vinculados a los ejercicios.',
    example: Course,
  })
  Courses: Course[];

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @ApiProperty({
    description:
      'Titulo de los ejercicios. Es de tipo varchar, tiene una longitud maxima de 100 caracteres. No puede ser nulo.',
    example: 'Programacion web',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @ApiProperty({ description: 'Tipo de ', example: 'Backend', required: true })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  solution_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  status_exercises: boolean;

  @Column({ type: 'enum', enum: difficulty, nullable: false })
  difficulty: difficulty;
}
