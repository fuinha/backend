import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Pet } from '../pet/pet'

@ObjectType()
@Entity()
export class Scan {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Field(() => Pet)
	@ManyToOne(() => Pet, (p) => p.scans)
	pet: Pet

	@Field(() => Date)
	@CreateDateColumn()
	createdAt: Date

	@Field()
	@Column()
	longitude: string

	@Field()
	@Column()
	latitude: string
}
