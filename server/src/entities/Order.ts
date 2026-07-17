import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm'
import { User } from './User'
import { Restaurant } from './Restaurant'
import { OrderItem } from './OrderItem'
import { DeliveryTracking } from './DeliveryTracking'

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  PICKED_UP = 'picked_up',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount!: number

  @Column('text')
  delivery_address!: string

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  delivery_lat!: number

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  delivery_lng!: number

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status!: PaymentStatus

  @Column('varchar', { nullable: true })
  razorpay_order_id!: string

  @Column('varchar', { nullable: true })
  razorpay_payment_id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @Column('uuid')
  customer_id!: string

  @Column('uuid')
  restaurant_id!: string

  @Column('uuid', { nullable: true })
  delivery_agent_id!: string

  @ManyToOne(() => User, (u) => u.orders)
  @JoinColumn({ name: 'customer_id' })
  customer!: User

  @ManyToOne(() => Restaurant, (r) => r.orders)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant

  @ManyToOne(() => User, (u) => u.deliveries)
  @JoinColumn({ name: 'delivery_agent_id' })
  delivery_agent!: User

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  items!: OrderItem[]

  @OneToMany(() => DeliveryTracking, (d) => d.order)
  tracking!: DeliveryTracking[]
}
