import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Contact } from '../contact'
import { ContactService } from '../service/contact.service'
import { Event } from '../../event/event'
import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'
import { Repository } from 'typeorm'

@Resolver()
export class ContactResolver extends BaseEntityResolver(Contact) {
	constructor(private service: ContactService) {
		super(service)
	}
}

@Resolver(() => Contact)
export class ContactFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Contact) private events: Repository<Contact>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Contact) {
		if (event.pet) {
			return event.pet
		} else {
			const { pet } = await this.events.findOneOrFail({
				relations: ['pet'],
			})
			console.log(pet)
			// .select('event.pet')
			// .execute()
			return pet
		}
		// return event.pet
	}
}
