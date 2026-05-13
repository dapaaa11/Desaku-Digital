import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

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
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    console.log(file);

    return this.newsService.create({
      title,
      content,
      image: file?.filename,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(Number(id));
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.newsService.update(Number(id), body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(Number(id));
  }

  @Get('test')
  test() {
    return { message: 'API jalan' };
  }
}
