import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Pet } from '../pet/pet'

@Entity()
@ObjectType()
export class User {
	@PrimaryColumn()
	@Field()
	id: string

	@OneToMany(() => Pet, (p) => p.owner)
	ownedPets: Pet[]

	@ManyToMany(() => Pet, (p) => p.caretakers)
	caretakingPets: Pet[]
}
