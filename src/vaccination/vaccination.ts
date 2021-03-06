import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pet } from '../pet/pet'

@ObjectType()
@Entity()
export class Vaccination {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Field()
	@Column()
	name: string

	@Field()
	@CreateDateColumn()
	createdDate: Date

	@Field()
	@Column()
	expirationDate: Date

	@Field()
	@Column()
	image_url: string

	@Field(() => Pet)
	@ManyToOne(() => Pet, (p) => p.vaccinations)
	pet: Pet
}
