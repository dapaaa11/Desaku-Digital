import { Module } from '@nestjs/common';
import { UmkmService } from './umkm.service';
import { UmkmController } from './umkm.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UmkmController],
  providers: [UmkmService, PrismaService],
})
export class UmkmModule {}
