import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pet } from '../pet/pet'

@Entity()
@ObjectType()
export class Contact {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string
	@Field()
	@Column()
	name: string
	@Field()
	@Column()
	number: string
	@Field()
	@Column()
	email: string
	@Field()
	@Column()
	address: string
	@Field(() => Pet)
	@ManyToOne(() => Pet, (p) => p.contacts)
	pet: Pet
}
