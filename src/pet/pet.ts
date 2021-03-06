import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	JoinTable,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user'
import { Vaccination } from '../vaccination/vaccination'
import { Vet } from '../vet/vet'
import { Scan } from '../scan/scan'
import { Event } from '../event/event'
import { Reminder } from '../reminder/reminder'
import { Contact } from '../contact/contact'

@Entity()
@ObjectType()
export class Pet {
	@Field()
	@PrimaryColumn()
	id: string

	@Field()
	@Column()
	lost: boolean

	@Field(() => User)
	@ManyToOne(() => User, (u) => u.ownedPets)
	owner: User[]

	@OneToMany(() => Contact, (c) => c.pet)
	@Field(() => [Contact])
	contacts: Contact[]

	@Field(() => [User])
	@ManyToMany(() => User, (u) => u.caretakingPets)
	@JoinTable({
		name: 'pet_caretakers',
		joinColumns: [{ name: 'pet_id' }],
		inverseJoinColumns: [{ name: 'user_id' }],
	})
	caretakers: User[]

	@Field()
	@Column()
	token: string

	@Field(() => [Reminder])
	@OneToMany(() => Reminder, (r) => r.pet)
	reminders: Reminder[]

	@Field()
	@Column()
	species: string

	@Field(() => Vet)
	@OneToOne(() => Vet, (v) => v.pet)
	vet: Vet

	@Field()
	@Column()
	specialNeeds: string

	@Field()
	@Column()
	temperament: string

	@Field()
	@Column()
	name: string

	@Field()
	@Column()
	serviceAnimal: boolean

	@Field()
	@Column()
	color: string

	@Field()
	@Column()
	breed: string

	@Field()
	@Column()
	birthdate: Date

	@Field(() => [String])
	@Column('text', { array: true })
	allergies: string[]

	@Field(() => [Vaccination])
	@OneToMany(() => Vaccination, (v) => v.pet)
	vaccinations: Vaccination[]

	@Field(() => [Scan])
	@OneToMany(() => Scan, (s) => s.pet)
	scans: Scan[]

	@Field(() => [Event])
	@OneToMany(() => Event, (e) => e.pet)
	events: Event[]
}
