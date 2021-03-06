import { Test, TestingModule } from '@nestjs/testing'
import { VetResolver } from './vet.resolver'

describe('VetResolver', () => {
	let resolver: VetResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VetResolver],
		}).compile()

		resolver = module.get<VetResolver>(VetResolver)
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})
})
