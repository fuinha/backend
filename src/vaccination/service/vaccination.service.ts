import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { Vaccination } from '../vaccination'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class VaccinationService extends BaseEntityService(Vaccination) {
	constructor(@InjectRepository(Vaccination) repo: Repository<Vaccination>) {
		super(repo)
	}
}
