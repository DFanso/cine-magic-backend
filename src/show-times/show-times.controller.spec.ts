import { Test, TestingModule } from '@nestjs/testing';
import { ShowTimesController } from './show-times.controller';
import { ShowTimesService } from './show-times.service';

describe('ShowTimesController', () => {
  let controller: ShowTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowTimesController],
      providers: [ShowTimesService],
    }).compile();

    controller = module.get<ShowTimesController>(ShowTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
