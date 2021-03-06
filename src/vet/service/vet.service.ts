import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Vet } from '../vet'

@Injectable()
export class VetService extends BaseEntityService(Vet) {
	constructor(@InjectRepository(Vet) private repo: Repository<Vet>) {
		super(repo)
	}
}
