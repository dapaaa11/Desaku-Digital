import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.news.findMany();
  }

  create(data: any) {
    return this.prisma.news.create({ data });
  }

  findOne(id: number) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.news.delete({
      where: { id },
    });
  }
}