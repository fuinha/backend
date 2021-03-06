import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Event } from '../event'
import { EventService } from '../service/event.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pet } from '../../pet/pet'

@Resolver()
export class EventResolver extends BaseEntityResolver(Event, false) {
	constructor(private service: EventService) {
		super(service)
	}
}

@Resolver(() => Event)
export class EventFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Event) private events: Repository<Event>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Event) {
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
