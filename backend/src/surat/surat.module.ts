import { Module } from '@nestjs/common';
import { SuratService } from './surat.service';
import { SuratController } from './surat.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SuratController],
  providers: [SuratService, PrismaService],
})
export class SuratModule {}
