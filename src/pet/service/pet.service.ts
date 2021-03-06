import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { Pet } from '../pet'
import { InjectRepository } from '@nestjs/typeorm'
import { Scan } from '../../scan/scan'
import { User } from '../../user/user'
import { Repository } from 'typeorm'
import { Vet } from '../../vet/vet'
import { Vaccination } from '../../vaccination/vaccination'
import { Event, EventType } from '../../event/event'
import { Reminder } from '../../reminder/reminder'
import crypto from 'crypto'
import { Contact } from '../../contact/contact'
import { ReminderService } from '../../reminder/service/reminder.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Resolver } from '@nestjs/graphql'

interface CreatePetInput {
	lost: boolean
	owner: User
	contacts: Contact[]
	caretakers: User[]
	species: string
	vet: Vet
	specialNeeds: boolean
	temperament: string
	name: string
	serviceAnimal: boolean
	color: string
	breed: string
	birthdate: Date
	allergies: string[]
	vaccinations: Vaccination[]
	scans: Scan[]
	reminders: Reminder[]
}

interface CreateVaccinationInput {
	name: string
	expirationDate: Date
	image_url: string
}

interface CreateContactInput {
	name: string
	number: string
	email: string
	address: string
}

interface CreateEventInput {
	title: string
	type: EventType
	description: string
	image_url: string
}

interface CreateScanInput {
	longitude: string
	latitude: string
}

interface CreateReminderInput {
	cron: string
	title: string
}

@Injectable()
export class PetService extends BaseEntityService(Pet) {
	constructor(
		@InjectRepository(Scan) private scans: Repository<Scan>,
		@InjectRepository(User) private users: Repository<User>,
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Event) private events: Repository<Event>,
		@InjectRepository(Reminder) private reminders: Repository<Reminder>,
		@InjectRepository(Contact) private contacts: Repository<Contact> // private reminderService: ReminderService // // @InjectQueue('reminders') private remindersQueue: Queue
	) {
		super(pets)
	}

	public async createPet(tag: string, object: CreatePetInput) {
		const pet = this.pets.create()

		Object.assign(pet, {
			id: tag,
			token: this.generateToken(),
			...object,
		})

		return await this.pets.save(pet)
	}

	public async regenerateToken(tag: string) {
		const pet = await this.pets.findOneOrFail(tag)
		pet.token = this.generateToken()
		await this.pets.save(pet)
		return pet
	}

	public async getWithToken(token: string) {
		return this.pets.findOneOrFail({
			where: {
				token,
			},
		})
	}

	public async updatePet(tag: string, object: Partial<CreatePetInput>) {
		const pet = await this.pets.findOneOrFail(tag, {
			relations: ['contacts', 'caretakers', 'vet', 'scans', 'vaccinations'],
		})

		Object.assign(pet, object)

		return await this.pets.save(pet)
	}

	public async addCaretaker(petID: string, userID: string): Promise<Pet> {
		const pet = await this.pets.findOneOrFail(petID, {
			relations: ['caretakers'],
		})
		const user = await this.users.findOneOrFail(userID, {
			relations: ['caretakingPets'],
		})

		user.caretakingPets.push(pet)
		await this.users.save(user)

		pet.caretakers.push(user)
		await this.pets.save(pet)

		return pet
	}

	public async addContact(petID: string, object: CreateContactInput) {
		const pet = await this.pets.findOneOrFail(petID, {
			relations: ['contacts'],
		})
		const contact = await this.contacts.create()
		Object.assign(contact, object)
		contact.pet = pet
		await this.contacts.save(contact)

		pet.contacts.push(contact)
		await this.pets.save(pet)

		return pet
	}

	public async updateReminder(
		id: string,
		object: Partial<CreateReminderInput>
	) {
		const reminder = await this.reminders.findOneOrFail(id)

		Object.assign(reminder, object)
		await this.reminders.save(reminder)

		return reminder
	}

	public async addEvent(tag: string, object: CreateEventInput) {
		const pet = await this.pets.findOneOrFail(tag, { relations: ['events'] })
		const event = await this.events.create()
		Object.assign(event, object)

		pet.events.push(event)
		await this.pets.save(pet)

		event.pet = pet
		await this.events.save(event)

		return pet
	}

	public async updateEvent(id: string, object: Partial<CreateEventInput>) {
		const event = await this.events.findOneOrFail(id)
		Object.assign(event, object)
		await this.events.save(event)

		return event
	}

	public async deleteEvent(id: string) {
		const event = await this.events.findOneOrFail(id, {
			relations: ['pet', 'pet.events'],
		})
		await this.events.remove(event)
		event.pet.events = event.pet.events.filter((z) => z.id !== event.id)
		await this.pets.save(event.pet)
		return event
	}

	public async addScan(tag: string, object: CreateScanInput) {
		const pet = await this.pets.findOneOrFail(tag, { relations: ['scans'] })
		const scan = await this.scans.create()
		Object.assign(scan, object)
		await this.scans.save(scan)

		pet.scans.push(scan)
	}

	public async toggleLost(tag: string) {
		const pet = await this.pets.findOneOrFail(tag)
		pet.lost = !pet.lost

		await this.pets.save(pet)
		return pet
	}

	public generateToken() {
		return Math.random().toString(36).substr(2, 5)
	}
}
