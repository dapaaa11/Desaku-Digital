import { Module } from '@nestjs/common';
import { VillageProfileController } from './village-profile.controller';
import { VillageProfileService } from './village-profile.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VillageProfileController],
  providers: [VillageProfileService, PrismaService],
})
export class VillageProfileModule {}
