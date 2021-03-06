import { Injectable } from '@nestjs/common'
import { BaseEntityService } from '../../shared/database'
import { Scan } from '../scan'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ScanService extends BaseEntityService(Scan) {
	constructor(@InjectRepository(Scan) private repo: Repository<Scan>) {
		super(repo)
	}
}
