import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm'
import { Order } from './Order'
import { User } from './User'

@Entity('delivery_tracking')
export class DeliveryTracking {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('decimal', { precision: 10, scale: 7 })
  latitude!: number

  @Column('decimal', { precision: 10, scale: 7 })
  longitude!: number

  @CreateDateColumn()
  timestamp!: Date

  @Column('uuid')
  order_id!: string

  @Column('uuid')
  delivery_agent_id!: string

  @ManyToOne(() => Order, (o) => o.tracking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order

  @ManyToOne(() => User, (u) => u.tracking_updates)
  @JoinColumn({ name: 'delivery_agent_id' })
  delivery_agent!: User
}
