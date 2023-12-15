import { Module } from '@nestjs/common';
import { ShowTimesService } from './show-times.service';
import { ShowTimesController } from './show-times.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShowTime, ShowTimeSchema } from './entities/show-time.entity';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShowTime.name, schema: ShowTimeSchema },
    ]),
    MoviesModule,
  ],
  controllers: [ShowTimesController],
  providers: [ShowTimesService],
  exports: [ShowTimesService],
})
export class ShowTimesModule {}
