import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SubsType } from '../enum/SubsType.enum';

@Entity({ name: 'subscription_types' })
export class SubscriptionType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string; // Ejemplo: "Mensual", "Anual"

  @Column({ default: SubsType.Mensual, nullable: false })
  type: SubsType;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number; // Precio asociado a este tipo de suscripción
}
