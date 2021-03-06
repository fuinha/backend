import { Test, TestingModule } from '@nestjs/testing'
import { PetFieldResolver } from './pet-field.resolver'

describe('PetFieldResolver', () => {
	let resolver: PetFieldResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PetFieldResolver],
		}).compile()

		resolver = module.get<PetFieldResolver>(PetFieldResolver)
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})
})
