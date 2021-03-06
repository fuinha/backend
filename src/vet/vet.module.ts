import { Module } from '@nestjs/common'
import { VetService } from './service/vet.service'
import { VetFieldResolver, VetResolver } from './resolver/vet.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Scan } from '../scan/scan'
import { Pet } from '../pet/pet'
import { Vet } from './vet'

@Module({
	providers: [VetService, VetResolver, VetFieldResolver],
	imports: [TypeOrmModule.forFeature([Vet, Pet])],
})
export class VetModule {}
