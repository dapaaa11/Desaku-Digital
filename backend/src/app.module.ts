import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VillageProfileModule } from './village-profile/village-profile.module';
import { GalleryModule } from './gallery/gallery.module';
import { UmkmModule } from './umkm/umkm.module';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    PrismaModule,
    UsersModule,
    VillageProfileModule,
    GalleryModule,
    UmkmModule,
  ],
})
export class AppModule {}
