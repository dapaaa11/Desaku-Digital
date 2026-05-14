import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UmkmService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description: string; whatsapp: string; address: string; image?: string }) {
    return this.prisma.umkm.create({ data });
  }

  findAll() {
    return this.prisma.umkm.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.umkm.findUnique({ where: { id } });
  }

  update(id: number, data: { name?: string; description?: string; whatsapp?: string; address?: string; image?: string }) {
    return this.prisma.umkm.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.umkm.delete({ where: { id } });
  }
}
