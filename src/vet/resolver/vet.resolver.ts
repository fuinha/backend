import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Vet } from '../vet'
import { VetService } from '../service/vet.service'

import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'
import { Repository } from 'typeorm'

@Resolver()
export class VetResolver extends BaseEntityResolver(Vet) {
	constructor(private service: VetService) {
		super(service)
	}
}

@Resolver(() => Vet)
export class VetFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Vet) private events: Repository<Vet>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Vet) {
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
