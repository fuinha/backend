import { Args, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql'
import { User } from '../user'
import { UserService } from '../service/user.service'
import { BaseEntityResolver } from '../../shared/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Pet } from '../../pet/pet'
import { Repository } from 'typeorm'

@Resolver()
export class UserResolver extends BaseEntityResolver(User) {
	constructor(private userService: UserService) {
		super(userService)
	}

	@Mutation(() => User)
	createUser(@Args('uid') uid: string) {
		return this.userService.createUser(uid)
	}
}

@Resolver(() => User)
export class UserFieldResolver {
	constructor(
		@InjectRepository(User) private repo: Repository<User>,
		@InjectRepository(Pet) private pet: Repository<Pet>
	) {}

	@ResolveField(() => [Pet])
	public async caretakingPets(@Root() root: User) {
		const user = await this.repo.findOneOrFail(root.id, {
			relations: ['caretakingPets'],
		})

		return user.caretakingPets
	}

	@ResolveField(() => [Pet])
	public async ownedPets(@Root() root: User) {
		const user = await this.repo.findOneOrFail(root.id, {
			relations: ['ownedPets'],
		})

		return user.ownedPets
	}
}
