import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';

import { VillageProfileService } from './village-profile.service';

@Controller('village-profile')
export class VillageProfileController {
  constructor(
    private readonly villageProfileService: VillageProfileService,
  ) {}

  @Get()
  findAll() {
    return this.villageProfileService.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.villageProfileService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body,
  ) {
    return this.villageProfileService.update(
      +id,
      body,
    );
  }
}