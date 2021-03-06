import { ResolveField, Resolver, Root } from '@nestjs/graphql'
import { BaseEntityResolver } from '../../shared/graphql'
import { Scan } from '../scan'
import { ScanService } from '../service/scan.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'
import { Repository } from 'typeorm'

@Resolver()
export class ScanResolver extends BaseEntityResolver(Scan) {
	constructor(private service: ScanService) {
		super(service)
	}
}

@Resolver(() => Scan)
export class ScanFieldResolver {
	constructor(
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Scan) private events: Repository<Scan>
	) {}

	@ResolveField(() => Pet)
	async pet(@Root() event: Scan) {
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
