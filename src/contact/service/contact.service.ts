import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { Contact } from '../contact'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ContactService extends BaseEntityService(Contact) {
	constructor(@InjectRepository(Contact) repository: Repository<Contact>) {
		super(repository)
	}
}
