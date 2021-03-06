import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '../user'
import { UserService } from '../service/user.service'

@Resolver()
export class UserResolver {
	constructor(private userService: UserService) {}
	@Mutation(() => User)
	createUser(@Args('uid') uid: string) {
		return this.userService.createUser(uid)
	}
}
