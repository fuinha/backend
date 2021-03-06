import { Module } from '@nestjs/common'
import { ContactService } from './service/contact.service'
import {
	ContactFieldResolver,
	ContactResolver,
} from './resolver/contact.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from './contact'
import { Pet } from '../pet/pet'

@Module({
	providers: [ContactService, ContactResolver, ContactFieldResolver],
	imports: [TypeOrmModule.forFeature([Contact, Pet])],
})
export class ContactModule {}
