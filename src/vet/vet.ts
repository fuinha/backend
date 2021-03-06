import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
	Column,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	JoinColumn,
} from 'typeorm'
import { IsEmail } from 'class-validator'
import { Pet } from '../pet/pet'

@ObjectType()
@Entity()
export class Vet {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	id: string

	@Column()
	@Field()
	name: string

	@Column()
	@Field()
	@IsEmail()
	email: string

	@Column()
	@Field()
	phoneNumber: string

	@Field(() => Pet)
	@OneToOne(() => Pet, (p) => p.vet)
	@JoinColumn({
		name: 'petid',
	})
	pet: Pet
}
