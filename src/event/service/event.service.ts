import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { Event } from '../event'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pet } from '../../pet/pet'
import { ResolveField, Resolver, Root } from '@nestjs/graphql'

@Injectable()
export class EventService extends BaseEntityService(Event) {
	constructor(
		@InjectRepository(Event) private events: Repository<Event>,
		@InjectRepository(Pet) private pets: Repository<Pet>
	) {
		super(events)
	}
}
