import { Test, TestingModule } from '@nestjs/testing';
import { VillageProfileService } from './village-profile.service';

describe('VillageProfileService', () => {
  let service: VillageProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VillageProfileService],
    }).compile();

    service = module.get<VillageProfileService>(VillageProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
