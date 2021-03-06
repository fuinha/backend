import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Pet } from '../pet/pet'

export enum EventType {
	Food,
	Treat,
	Walk,
	Poop,
	Pee,
	Medication,
	Grooming,
	Weight,
	Custom,
}

registerEnumType(EventType, {
	name: 'EventType',
})

@ObjectType()
@Entity()
export class Event {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => String)
	@Column()
	title: string

	@Field(() => EventType)
	@Column('int')
	type: EventType

	@Field()
	@Column()
	description: string

	@Field()
	@Column()
	image_url: string

	@Field()
	@CreateDateColumn()
	date: Date

	@Field(() => Pet)
	@ManyToOne(() => Pet, (p) => p.events)
	pet: Pet
}
