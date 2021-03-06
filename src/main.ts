import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication } from '@nestjs/common'
import * as dotenv from 'dotenv'

export class Backend {
	private app: INestApplication

	constructor(private dbURL: string, private redis: string) {}

	public async bootstrap(port?: number) {
		const app = await NestFactory.create(AppModule(this.dbURL, this.redis))
		await app.listen(port ?? 3000)
		this.app = app
	}
}

;(async () => {
	dotenv.config()
	const instance = new Backend(process.env.db, process.env.redis)
	await instance.bootstrap(3000)
})()
