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
import { AuthModule } from './auth/auth.module'
import {
	FirebaseAdminModule,
	FirebaseAuthenticationService,
} from '@aginix/nestjs-firebase-admin'
import * as admin from 'firebase-admin'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/guard/auth.guard'

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
				...(process.env.NODE_ENV === 'production'
					? {
							ssl: true,
							extra: { ssl: true, rejectUnauthorized: false },
					  }
					: {}),
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
			AuthModule,
			FirebaseAdminModule.forRootAsync({
				useFactory: () => ({
					credential: admin.credential.cert(JSON.parse(process.env.admin)),
				}),
			}),
		],
		controllers: [],
		providers: [
			{
				provide: APP_GUARD,
				useClass: AuthGuard,
			},
			// FirebaseAuthenticationService,
		],
	})
	abstract class BaseAppModule {}

	return BaseAppModule
}
