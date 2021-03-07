import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user'
import { UserService } from './service/user.service'
import { UserFieldResolver, UserResolver } from './resolver/user.resolver'
import { Pet } from '../pet/pet'
import { Vaccination } from '../vaccination/vaccination'
import { Reminder } from '../reminder/reminder'
import { Scan } from '../scan/scan'
import { Event } from '../event/event'
import { Contact } from '../contact/contact'

@Module({
	exports: [UserService],
	providers: [UserService, UserResolver, UserFieldResolver],
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
export class UserModule {}
