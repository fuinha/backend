import { Global, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/user'
import { PetModule } from './pet/pet.module'
import { ReminderModule } from './reminder/reminder.module'
import { VaccinationModule } from './vaccination/vaccination.module'
import { EventModule } from './event/event.module'
import { ScanModule } from './scan/scan.module'
import { VetModule } from './vet/vet.module'
import { BullModule } from '@nestjs/bull'
import { Vaccination } from './vaccination/vaccination'
import { Reminder } from './reminder/reminder'
import { Scan } from './scan/scan'
import { Event } from './event/event'
import { Contact } from './contact/contact'
import { Pet } from './pet/pet'
import { Vet } from './vet/vet'
import { ContactService } from './contact/service/contact.service'
import { ContactModule } from './contact/contact.module'

export const AppModule = (dbURL: string, redis: string): any => {
	@Global()
	@Module({
		imports: [
			UserModule,
			TypeOrmModule.forRoot({
				type: 'postgres',
				url: dbURL,
				entities: [User, Pet, Vaccination, Reminder, Scan, Event, Contact, Vet],
				synchronize: true,
				ssl: true,
				extra: { ssl: true, rejectUnauthorized: false },
				// extra: {
				// 	ssl: true,
				// },
			}),
			GraphQLModule.forRoot({
				playground: true,

				introspection: true,
				autoSchemaFile: join(process.cwd() + 'src/schema.gql'),
				sortSchema: true,
			}),
			BullModule.forRoot({
				redis,
			}),
			PetModule,
			ReminderModule,
			VaccinationModule,
			EventModule,
			ScanModule,
			VetModule,
			ContactModule,
		],
		controllers: [],
		providers: [],
	})
	abstract class BaseAppModule {}

	return BaseAppModule
}
