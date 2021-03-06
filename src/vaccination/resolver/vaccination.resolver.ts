import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { VaccinationService } from '../service/vaccination.service'

import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'
import { Repository } from 'typeorm'
import { Vaccination } from '../vaccination'

@Resolver()
export class VaccinationResolver extends BaseEntityResolver(Vaccination) {
	constructor(private service: VaccinationService) {
		super(service)
	}
}

@Resolver(() => Vaccination)
export class VaccinationFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Vaccination) private events: Repository<Vaccination>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Vaccination) {
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
