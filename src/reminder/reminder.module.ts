import { Module } from '@nestjs/common'
import { ReminderService } from './service/reminder.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user'
import { Pet } from '../pet/pet'
import { Vaccination } from '../vaccination/vaccination'
import { Reminder } from './reminder'
import { Scan } from '../scan/scan'
import { Event } from '../event/event'
import { Contact } from '../contact/contact'
import { ReminderProcessor } from './reminder.processor'
import { BullModule } from '@nestjs/bull'
import { PetResolver } from '../pet/resolver/pet.resolver'
import { PetService } from '../pet/service/pet.service'
import { Vet } from '../vet/vet'
import { ReminderResolver } from './resolver/reminder.resolver'

@Module({
	providers: [
		ReminderService,
		ReminderProcessor,
		PetResolver,
		PetService,
		ReminderResolver,
	],
	exports: [ReminderProcessor],
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
		BullModule.registerQueue({
			name: 'reminders',
		}),
	],
})
export class ReminderModule {}
