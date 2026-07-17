import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn
} from 'typeorm'
import { Restaurant } from './Restaurant'
import { MenuItem } from './MenuItem'

@Entity('menu_categories')
export class MenuCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  name!: string

  @Column('int', { default: 0 })
  sort_order!: number

  @Column('uuid')
  restaurant_id!: string

  @ManyToOne(() => Restaurant, (r) => r.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant

  @OneToMany(() => MenuItem, (i) => i.category)
  items!: MenuItem[]
}
