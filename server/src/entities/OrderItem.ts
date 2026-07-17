import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn
} from 'typeorm'
import { Order } from './Order'
import { MenuItem } from './MenuItem'

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('int')
  quantity!: number

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price!: number

  @Column('uuid')
  order_id!: string

  @Column('uuid')
  menu_item_id!: string

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menu_item!: MenuItem
}
