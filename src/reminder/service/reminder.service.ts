import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { BaseEntityService } from '../../shared/database'
import { Reminder } from '../reminder'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../user/user'
import { Repository } from 'typeorm'
import { Contact } from '../../contact/contact'
import { Vaccination } from '../../vaccination/vaccination'
import { Pet } from '../../pet/pet'

interface CreateReminderInput {
	cron: string
	title: string
}

@Injectable()
export class ReminderService extends BaseEntityService(Reminder) {
	constructor(
		@InjectQueue('reminders') private remindersQueue: Queue,
		@InjectRepository(Pet) private pets: Repository<Pet>,
		@InjectRepository(Contact) private contacts: Repository<Contact>,
		@InjectRepository(Vaccination)
		private vaccinations: Repository<Vaccination>,
		@InjectRepository(Reminder) private reminders: Repository<Reminder>
	) {
		super(reminders)
	}

	public async queueReminder(id: string, cron: string) {
		console.log(id)
		const z = await this.remindersQueue.add(
			{ id },
			{
				repeat: {
					cron,
				},
				jobId: id,
			}
		)
		console.log(z)
		return z.name
	}
	public async removeRepeatable(z: any, x: any) {
		return this.remindersQueue.removeRepeatable(x)
	}

	public async addReminder(tag: string, object: CreateReminderInput) {
		const pet = await this.pets.findOneOrFail(tag, { relations: ['reminders'] })
		const reminder = await this.reminders.create()
		Object.assign(reminder, object)

		reminder.pet = pet
		reminder.redisID = ''
		await this.reminders.save(reminder)
		console.log('id: ' + reminder.id)
		reminder.redisID = await this.queueReminder(reminder.id, object.cron)
		await this.reminders.save(reminder)
		pet.reminders.push(reminder)
		await this.pets.save(pet)

		return pet
	}

	public async deleteReminder(id: string) {
		const reminder = await this.reminders.findOneOrFail(id)
		await this.reminders.remove(reminder)
		await this.removeRepeatable(id, {
			cron: reminder.cron,
			jobId: id,
		})

		return true
	}
}
