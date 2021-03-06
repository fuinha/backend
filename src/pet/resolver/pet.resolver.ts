import {
	Args,
	Field,
	InputType,
	Mutation,
	Query,
	Resolver,
} from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Pet } from '../pet'
import { PetService } from '../service/pet.service'
import { User } from '../../user/user'
import { Vet } from '../../vet/vet'
import { Vaccination } from '../../vaccination/vaccination'
import { Scan } from '../../scan/scan'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../contact/contact'
import { ReminderService } from '../../reminder/service/reminder.service'
import { Reminder } from '../../reminder/reminder'
import { Event, EventType } from '../../event/event'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@InputType()
class VetInput {
	@Field()
	name: string
	@Field()
	email: string
	@Field()
	phoneNumber: string
}

@InputType()
class ReminderInput {
	@Field()
	title: string
	@Field()
	cron: string
}

@InputType()
class ScanInput {
	@Field()
	longitude: string
	@Field()
	latitude: string
}

@InputType()
class ContactInput {
	@Field()
	name: string
	@Field()
	number: string
	@Field()
	email: string
	@Field()
	address: string
}

@InputType()
class VaccinationInput {
	@Field()
	name: string
	@Field()
	expirationDate: Date
	@Field()
	image_url: string
}

@InputType()
class EventInput {
	@Field()
	title: string
	@Field(() => EventType)
	type: EventType
	@Field()
	description: string
	@Field()
	image_url: string
}

@InputType()
class CreatePetInput {
	@Field()
	species: string
	@Field()
	vet: VetInput
	@Field(() => [ContactInput])
	contacts: ContactInput[]
	@Field()
	specialNeeds: string
	@Field()
	temperament: string
	@Field()
	name: string
	@Field()
	serviceAnimal: boolean
	@Field()
	color: string
	@Field()
	breed: string
	@Field()
	birthdate: Date
	@Field(() => [String])
	allergies: string[]
	@Field(() => [VaccinationInput])
	vaccinations: VaccinationInput[]
	@Field(() => [ReminderInput])
	reminders: ReminderInput[]
}

@InputType()
class UpdatePetInput {
	@Field({ nullable: true })
	species?: string
	@Field({ nullable: true })
	specialNeeds?: string
	@Field({ nullable: true })
	temperament?: string
	@Field({ nullable: true })
	name?: string
	@Field({ nullable: true })
	serviceAnimal?: boolean
	@Field({ nullable: true })
	color?: string
	@Field({ nullable: true })
	breed?: string
	@Field({ nullable: true })
	birthdate?: Date
	@Field(() => [String], { nullable: true })
	allergies?: string[]
}

@Resolver()
export class PetResolver extends BaseEntityResolver(Pet) {
	constructor(
		private service: PetService,
		@InjectQueue('reminders') remQueue: Queue,
		@InjectRepository(User) private users: Repository<User>,
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Contact) private contacts: Repository<Contact>,
		@InjectRepository(Vaccination)
		private vaccinations: Repository<Vaccination>,
		@InjectRepository(Reminder) private reminders: Repository<Reminder>,
		@InjectRepository(Vet) private vets: Repository<Vet>,
		private remindersQueue: ReminderService
	) {
		super(service)
	}

	@Mutation(() => Pet)
	public async createPet(
		@Args('user') uid: string,
		@Args('id') id: string,
		@Args('object') object: CreatePetInput
	) {
		const pet = await this.pets.create()
		const user = await this.users.findOneOrFail(uid, {
			relations: ['ownedPets' as keyof User],
		})

		console.log('contacts')
		const contacts = await Promise.all(
			object.contacts.map(async (z) => {
				console.log('awef')
				const cont = await this.contacts.create()
				console.log('awef')
				cont.address = z.address
				cont.email = z.email
				cont.name = z.name
				cont.number = z.number
				// cont.pet = pet
				// console.log('awef')
				await this.contacts.save(cont)
				return cont
			})
		)

		console.log('vacc')
		const vaccinations = await Promise.all(
			object.vaccinations.map(async (z) => {
				const vax = await this.vaccinations.create()
				// vax.pet = pet
				vax.expirationDate = z.expirationDate
				vax.image_url = z.image_url
				vax.name = z.name
				return this.vaccinations.save(vax)
			})
		)

		console.log('reminders')
		const reminders = await Promise.all(
			object.reminders.map(async (z) => {
				const reminder = await this.reminders.create()
				reminder.cron = z.cron
				reminder.title = z.title
				const redisID = await this.remindersQueue.queueReminder(
					reminder.id,
					z.cron
				)
				reminder.redisID = redisID
				// reminder.pet = pet

				return await this.reminders.save(reminder)
			})
		)

		const vet = await this.vets.create()
		vet.email = object.vet.email
		vet.phoneNumber = object.vet.phoneNumber
		vet.name = object.vet.name
		// vet.pet = pet
		const z = await this.vets.save(vet)

		Object.assign(pet, {
			id,
			token: this.service.generateToken(),
			allergies: object.allergies,
			serviceAnimal: object.serviceAnimal,
			name: object.name,
			specialNeeds: object.serviceAnimal,
			birthdate: object.birthdate,
			breed: object.breed,
			caretakers: [],
			color: object.color,
			lost: false,
			owner: user,

			scans: [],
			species: object.species,
			temperament: object.temperament,
			contacts,
			vaccinations,
			vet,
			reminders,
		})

		console.log('done')
		await this.pets.save(pet)
		console.log('done')

		await Promise.all(
			contacts.map(async (z) => {
				z.pet = pet

				await this.contacts.save(z)
			})
		)
		await Promise.all(
			reminders.map(async (z) => {
				z.pet = pet

				await this.reminders.save(z)
			})
		)
		await Promise.all(
			vaccinations.map(async (z) => {
				z.pet = pet
				await this.vaccinations.save(z)
			})
		)

		vet.pet = pet
		await this.vets.save(vet)

		return pet
	}

	@Mutation(() => Pet)
	public regenerateToken(@Args('tag') tag: string) {
		return this.service.regenerateToken(tag)
	}

	@Query(() => Pet)
	public findPetWithToken(@Args('token') token: string) {
		return this.service.getWithToken(token)
	}

	@Mutation(() => Pet)
	public updatePet(
		@Args('tag') id: string,
		@Args('object')
		object: UpdatePetInput
	) {
		return this.service.updatePet(id, object as any)
	}

	@Mutation(() => Pet)
	public addCaretaker(@Args('user') id: string, @Args('tag') tag: string) {
		return this.service.addCaretaker(tag, id)
	}

	@Mutation(() => Pet)
	public addContact(
		@Args('tag') tag: string,
		@Args('object') object: ContactInput
	) {
		return this.service.addContact(tag, object)
	}

	@Mutation(() => Pet)
	public addEvent(
		@Args('tag') tag: string,
		@Args('object') object: EventInput
	) {
		return this.service.addEvent(tag, object)
	}

	@Mutation(() => Pet)
	public addScan(@Args('tag') tag: string, @Args('object') object: ScanInput) {
		return this.service.addScan(tag, object)
	}

	@Mutation(() => Event)
	public deleteEvent(@Args('id') id: string) {
		return this.service.deleteEvent(id)
	}

	@Mutation(() => Pet)
	public toggleLost(@Args('tag') tag: string) {
		return this.service.toggleLost(tag)
	}

	@Mutation(() => Pet)
	public addReminder(
		@Args('tag') tag: string,
		@Args('object') object: ReminderInput
	) {
		return this.remindersQueue.addReminder(tag, object)
	}
}
