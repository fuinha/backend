import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pet } from '../pet/pet'

@Entity()
@ObjectType()
export class Reminder {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Field(() => Pet)
	@ManyToOne(() => Pet, (p) => p.reminders)
	pet: Pet

	@Field()
	@Column()
	cron: string

	@Field()
	@CreateDateColumn()
	createdAt: Date

	@Field()
	@Column()
	title: string

	@Column()
	redisID: string
}
