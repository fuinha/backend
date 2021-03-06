import { Module } from '@nestjs/common'
import { VaccinationService } from './service/vaccination.service'
import {
	VaccinationFieldResolver,
	VaccinationResolver,
} from './resolver/vaccination.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Scan } from '../scan/scan'
import { Pet } from '../pet/pet'
import { Vaccination } from './vaccination'

@Module({
	providers: [
		VaccinationService,
		VaccinationResolver,
		VaccinationFieldResolver,
	],
	imports: [TypeOrmModule.forFeature([Vaccination, Pet])],
})
export class VaccinationModule {}
