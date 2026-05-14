import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule {}