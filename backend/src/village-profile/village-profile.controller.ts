import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { VillageProfileService } from './village-profile.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('village-profile')
export class VillageProfileController {
  constructor(private readonly villageProfileService: VillageProfileService) {}

  @Get()
  findAll() {
    return this.villageProfileService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('about') about: string,
    @Body('vision') vision: string,
    @Body('mission') mission: string,
    @Body('address') address: string,
  ) {
    return this.villageProfileService.create({
      name,
      about,
      vision,
      mission,
      address,
      image: file?.filename,
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('about') about: string,
    @Body('vision') vision: string,
    @Body('mission') mission: string,
    @Body('address') address: string,
  ) {
    const updateData: any = {
      name,
      about,
      vision,
      mission,
      address,
    };
    if (file?.filename) {
      updateData.image = file.filename;
    }
    return this.villageProfileService.update(+id, updateData);
  }
}
