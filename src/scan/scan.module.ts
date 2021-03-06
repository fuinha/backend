import { Module } from '@nestjs/common'
import { ScanService } from './service/scan.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contact } from '../contact/contact'
import { Pet } from '../pet/pet'
import { Scan } from './scan'
import { ScanFieldResolver, ScanResolver } from './resolver/scan.resolver'

@Module({
	providers: [ScanService, ScanResolver, ScanFieldResolver],
	imports: [TypeOrmModule.forFeature([Scan, Pet])],
})
export class ScanModule {}
