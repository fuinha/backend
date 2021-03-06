import { Module } from '@nestjs/common'
import { EventService } from './service/event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user'
import { Pet } from '../pet/pet'
import { Vaccination } from '../vaccination/vaccination'
import { Reminder } from '../reminder/reminder'
import { Scan } from '../scan/scan'
import { Event } from './event'
import { Contact } from '../contact/contact'
import { EventFieldResolver, EventResolver } from './resolver/event.resolver'

@Module({
	providers: [EventService, EventResolver, EventFieldResolver],
	imports: [
		TypeOrmModule.forFeature([
			User,
			Pet,
			Vaccination,
			Reminder,
			Scan,
			Event,
			Contact,
		]),
	],
})
export class EventModule {}
