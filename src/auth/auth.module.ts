import { Global, Module } from '@nestjs/common'
import {
	FirebaseAdminModule,
	FirebaseAuthenticationService,
} from '@aginix/nestjs-firebase-admin'

// @Global()
@Module({
	// providers: [FirebaseAuthenticationService],
	// imports: [FirebaseAdminModule],
	// exports: [FirebaseAuthenticationService],
})
export class AuthModule {}
