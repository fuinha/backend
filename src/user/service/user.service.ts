import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user'
import { Repository } from 'typeorm'
import { hash } from '../../shared/hash'
import { BaseEntityService } from '../../shared/database'
import { Pet } from '../../pet/pet'

@Injectable()
export class UserService extends BaseEntityService(User) {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Pet) private petRepository: Repository<Pet>
	) {
		super(userRepository)
	}

	async createUser(uid: string): Promise<User> {
		const entity = this.userRepository.create()

		entity.id = uid
		entity.ownedPets = []
		entity.caretakingPets = []

		await this.userRepository.save(entity)

		return entity
	}
}
