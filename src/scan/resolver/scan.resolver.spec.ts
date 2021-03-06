import { Test, TestingModule } from '@nestjs/testing'
import { ScanResolver } from './scan.resolver'

describe('ScanResolver', () => {
	let resolver: ScanResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ScanResolver],
		}).compile()

		resolver = module.get<ScanResolver>(ScanResolver)
	})

	it('should be defined', () => {
		expect(resolver).toBeDefined()
	})
})
