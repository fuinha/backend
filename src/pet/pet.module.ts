import { Module } from '@nestjs/common'
import { PetResolver } from './resolver/pet.resolver'
import { PetService } from './service/pet.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user'
import { Pet } from './pet'
import { Vaccination } from '../vaccination/vaccination'
import { Reminder } from '../reminder/reminder'
import { Scan } from '../scan/scan'
import { Event } from '../event/event'
import { Contact } from '../contact/contact'
import { Vet } from '../vet/vet'
import { PetFieldResolver } from './resolver/pet-field.resolver'
import { EventModule } from '../event/event.module'
import { EventService } from '../event/service/event.service'
@Module({
	providers: [PetService, PetFieldResolver, EventService],
	imports: [
		TypeOrmModule.forFeature([
			User,
			Pet,
			Vaccination,
			Reminder,
			Scan,
			Event,
			Contact,
			Vet,
		]),
		// EventModule,
		// BullModule.registerQueue({
		// 	name: 'reminders',
		// }),
	],
})
export class PetModule {}
