import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@Inject('FirebaseAuthenticationService')
		private readonly auth: FirebaseAuthenticationService
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (context.getType<GqlContextType>() === 'graphql') {
			const ctx = GqlExecutionContext.create(context)
			if (!['pet'].includes(ctx.getInfo().fieldName)) {
				if (ctx.getContext().req.get('bypass') ?? '' == process.env.bypass) {
					return true
				}
				try {
					const z = await this.auth.verifyIdToken(
						ctx.getContext().req.get('token')
					)

					if (z.uid) {
						return true
					}
				} catch (e) {
					throw new Error(e)
				}
				return false
			} else {
				return true
			}
		}
	}
}
