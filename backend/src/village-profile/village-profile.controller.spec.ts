import { Test, TestingModule } from '@nestjs/testing';
import { VillageProfileController } from './village-profile.controller';
import { VillageProfileService } from './village-profile.service';

describe('VillageProfileController', () => {
  let controller: VillageProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillageProfileController],
      providers: [VillageProfileService],
    }).compile();

    controller = module.get<VillageProfileController>(VillageProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
