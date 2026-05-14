import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  create(data: { title?: string; image: string }) {
    return this.prisma.gallery.create({ data });
  }

  createMany(data: { title?: string; image: string }[]) {
    return this.prisma.gallery.createMany({ data });
  }

  findAll() {
    return this.prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.gallery.findUnique({ where: { id } });
  }

  update(id: number, data: { title?: string; image?: string }) {
    return this.prisma.gallery.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.gallery.delete({ where: { id } });
  }
}
