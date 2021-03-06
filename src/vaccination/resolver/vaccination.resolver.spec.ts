import { Test, TestingModule } from '@nestjs/testing'
import { VaccinationResolver } from './vaccination.resolver'

describe('VaccinationResolver', () => {
	let resolver: VaccinationResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VaccinationResolver],
		}).compile()

		resolver = module.get<VaccinationResolver>(VaccinationResolver)
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})
})
