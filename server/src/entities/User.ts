import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
} from 'typeorm'
import { Order } from './Order'
import { Restaurant } from './Restaurant'
import { DeliveryTracking } from './DeliveryTracking'

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  DELIVERY_AGENT = 'delivery_agent',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  name!: string

  @Column('varchar', { unique: true })
  email!: string

  @Column('varchar')
  password!: string

  @Column('varchar', { nullable: true })
  phone!: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole

  @Column('boolean', { default: true })
  is_active!: boolean

  @CreateDateColumn()
  created_at!: Date

  @OneToMany(() => Restaurant, (r) => r.owner)
  restaurants!: Restaurant[]

  @OneToMany(() => Order, (o) => o.customer)
  orders!: Order[]

  @OneToMany(() => Order, (o) => o.delivery_agent)
  deliveries!: Order[]

  @OneToMany(() => DeliveryTracking, (d) => d.delivery_agent)
  tracking_updates!: DeliveryTracking[]
}
