import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SuratService } from './surat.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('surat')
export class SuratController {
  constructor(private readonly suratService: SuratService) {}

  @Get()
  findAll() {
    return this.suratService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suratService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body('nama') nama: string,
    @Body('nik') nik: string,
    @Body('jenis') jenis: string,
    @Body('keperluan') keperluan: string,
  ) {
    return this.suratService.create({ nama, nik, jenis, keperluan });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('nama') nama?: string,
    @Body('nik') nik?: string,
    @Body('jenis') jenis?: string,
    @Body('keperluan') keperluan?: string,
    @Body('status') status?: string,
  ) {
    const updateData: any = {};
    if (nama !== undefined) updateData.nama = nama;
    if (nik !== undefined) updateData.nik = nik;
    if (jenis !== undefined) updateData.jenis = jenis;
    if (keperluan !== undefined) updateData.keperluan = keperluan;
    if (status !== undefined) updateData.status = status;

    return this.suratService.update(+id, updateData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suratService.remove(+id);
  }
}
