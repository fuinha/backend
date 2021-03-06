import {
	Args,
	ResolveField,
	ResolveProperty,
	Resolver,
	Root,
} from '@nestjs/graphql'
import { Pet } from '../pet'
import { InjectRepository } from '@nestjs/typeorm'
import { EventService } from '../../event/service/event.service'
import {
	mapPaginationToFindProps,
	PaginationInput,
} from '../../shared/graphql/Pagination'
import { FindManyOptions, Repository } from 'typeorm'
import { Event } from '../../event/event'
import { Scan } from '../../scan/scan'
import { Reminder } from '../../reminder/reminder'
import { Vaccination } from '../../vaccination/vaccination'
import { Contact } from '../../contact/contact'

@Resolver(() => Pet)
export class PetFieldResolver {
	constructor(
		private eventService: EventService,
		@InjectRepository(Event) private eventRepository: Repository<Event>,
		@InjectRepository(Scan) private scanRepository: Repository<Scan>,
		@InjectRepository(Reminder)
		private reminderRepository: Repository<Reminder>,
		@InjectRepository(Vaccination)
		private vaccinationRepository: Repository<Vaccination>,
		@InjectRepository(Contact) private contactRepository: Repository<Contact>
	) {}

	@ResolveField(() => [Event])
	public async events(
		@Root() pet: Pet,
		@Args('options', { nullable: true }) options?: PaginationInput
	) {
		const z = await this.eventRepository
			.createQueryBuilder('event')
			.leftJoin('event.pet', 'pet')
			.where('pet.id = :id', { id: pet.id })
			.skip(options?.skip)
			.take(options?.take)
			.orderBy(options?.sort?.field, options?.sort?.order)
			.getMany()
		console.log('hi')
		console.log(z)

		return z
	}

	@ResolveField(() => [Scan])
	public async scans(
		@Root() pet: Pet,
		@Args('options', { nullable: true }) options?: PaginationInput
	) {
		const z = await this.scanRepository
			.createQueryBuilder('scan')
			.leftJoin('scan.pet', 'pet')
			.where('pet.id = :id', { id: pet.id })
			.skip(options?.skip)
			.take(options?.take)
			.orderBy(options?.sort?.field, options?.sort?.order)
			.getMany()

		return z
	}

	@ResolveField(() => [Reminder])
	public async reminders(
		@Root() pet: Pet,
		@Args('options', { nullable: true }) options?: PaginationInput
	) {
		const z = await this.reminderRepository
			.createQueryBuilder('entity')
			.leftJoin('entity.pet', 'pet')
			.where('pet.id = :id', { id: pet.id })
			.skip(options?.skip)
			.take(options?.take)
			.orderBy(options?.sort?.field, options?.sort?.order)
			.getMany()

		return z
	}

	@ResolveField(() => [Contact])
	public async contacts(
		@Root() pet: Pet,
		@Args('options', { nullable: true }) options?: PaginationInput
	) {
		const z = await this.contactRepository
			.createQueryBuilder('entity')
			.leftJoin('entity.pet', 'pet')
			.where('pet.id = :id', { id: pet.id })
			.skip(options?.skip)
			.take(options?.take)
			.orderBy(options?.sort?.field, options?.sort?.order)
			.getMany()

		return z
	}

	@ResolveField(() => [Vaccination])
	public async vaccinations(
		@Root() pet: Pet,
		@Args('options', { nullable: true }) options?: PaginationInput
	) {
		const z = await this.vaccinationRepository
			.createQueryBuilder('entity')
			.leftJoin('entity.pet', 'pet')
			.where('pet.id = :id', { id: pet.id })
			.skip(options?.skip)
			.take(options?.take)
			.orderBy(options?.sort?.field, options?.sort?.order)
			.getMany()

		return z
	}
}
