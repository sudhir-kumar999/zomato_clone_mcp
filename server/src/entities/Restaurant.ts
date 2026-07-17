import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm'
import { User } from './User'
import { MenuCategory } from './MenuCategory'
import { MenuItem } from './MenuItem'
import { Order } from './Order'

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  name!: string

  @Column('text', { nullable: true })
  description!: string

  @Column('varchar', { nullable: true })
  cuisine!: string

  @Column('text', { nullable: true })
  address!: string

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude!: number

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude!: number

  @Column('varchar', { nullable: true })
  cover_image!: string

  @Column('boolean', { default: true })
  is_active!: boolean

  @Column('boolean', { default: false })
  is_approved!: boolean

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  commission_rate!: number

  @CreateDateColumn()
  created_at!: Date

  @Column('uuid')
  owner_id!: string

  @ManyToOne(() => User, (u) => u.restaurants)
  @JoinColumn({ name: 'owner_id' })
  owner!: User

  @OneToMany(() => MenuCategory, (c) => c.restaurant)
  categories!: MenuCategory[]

  @OneToMany(() => MenuItem, (i) => i.restaurant)
  menu_items!: MenuItem[]

  @OneToMany(() => Order, (o) => o.restaurant)
  orders!: Order[]
}
