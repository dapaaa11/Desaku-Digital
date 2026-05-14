import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuratService {
  constructor(private prisma: PrismaService) {}

  create(data: { nama: string; nik: string; jenis: string; keperluan: string }) {
    return this.prisma.surat.create({ data });
  }

  findAll() {
    return this.prisma.surat.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.surat.findUnique({ where: { id } });
  }

  update(id: number, data: { nama?: string; nik?: string; jenis?: string; keperluan?: string; status?: string }) {
    return this.prisma.surat.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.surat.delete({ where: { id } });
  }
}
