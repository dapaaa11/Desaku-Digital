import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VillageProfileService {
  constructor(
    private prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.villageProfile.findMany();
  }

  create(data: any) {
    return this.prisma.villageProfile.create({
      data,
    });
  }

  update(id: number, data: any) {
    return this.prisma.villageProfile.update({
      where: { id },
      data,
    });
  }
}