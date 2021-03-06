import { OnQueueActive, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { InjectRepository } from '@nestjs/typeorm'
import { Reminder } from './reminder'
import { Repository } from 'typeorm'

@Processor('reminders')
export class ReminderProcessor {
	constructor(
		@InjectRepository(Reminder) private reminders: Repository<Reminder>
	) {}
	@Process()
	async process(job: Job) {
		console.log('hi')
		const reminder = await this.reminders.findOne(job.data.id, {
			relations: ['pet'],
		})
		console.log(JSON.stringify(reminder, null, 2))
		return {}
	}

	@OnQueueActive()
	onActive(job: Job) {
		console.log(
			`Processing job ${job.id} of type ${job.name} with data ${job.data}...`
		)
	}
}
