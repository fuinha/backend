import { Args, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntity, Repository } from 'typeorm'
import { BaseEntityResolver } from '../../shared/graphql'
import { Reminder } from '../reminder'
import { ReminderService } from '../service/reminder.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'

@Resolver()
export class ReminderResolver extends BaseEntityResolver(Reminder) {
	constructor(private service: ReminderService) {
		super(service)
	}

	@Mutation(() => Boolean)
	async removeReminder(@Args('reminder') reminder: string) {
		return this.service.deleteReminder(reminder)
	}
}

@Resolver(() => Reminder)
export class ReminderFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Reminder) private events: Repository<Reminder>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Reminder) {
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
