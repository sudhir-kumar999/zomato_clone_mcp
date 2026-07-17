import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn
} from 'typeorm'
import { Restaurant } from './Restaurant'
import { MenuCategory } from './MenuCategory'

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  name!: string

  @Column('text', { nullable: true })
  description!: string

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number

  @Column('varchar', { nullable: true })
  image!: string

  @Column('boolean', { default: true })
  is_available!: boolean

  @Column('boolean', { default: false })
  is_vegetarian!: boolean

  @Column('uuid')
  restaurant_id!: string

  @Column('uuid')
  category_id!: string

  @ManyToOne(() => Restaurant, (r) => r.menu_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant!: Restaurant

  @ManyToOne(() => MenuCategory, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: MenuCategory
}
