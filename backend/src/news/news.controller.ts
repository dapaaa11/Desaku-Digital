import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.newsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.newsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(Number(id));
  }

  @Get('test')
  test() {
    return { message: 'API jalan' };
  }
}