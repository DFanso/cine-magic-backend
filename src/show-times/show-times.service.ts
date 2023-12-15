import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShowTimeDto } from './dto/create-show-time.dto';
import { UpdateShowTimeDto } from './dto/update-show-time.dto';
import { ShowTime, ShowTimeDocument } from './entities/show-time.entity';

@Injectable()
export class ShowTimesService {
  constructor(
    @InjectModel(ShowTime.name) private showTimeModel: Model<ShowTimeDocument>,
  ) {}

  async create(createShowTimeDto: CreateShowTimeDto): Promise<ShowTime> {
    const createdShowTime = new this.showTimeModel(createShowTimeDto);
    return createdShowTime.save();
  }

  async findAll(movieId: string): Promise<ShowTime[]> {
    return this.showTimeModel.find({ movieId }).populate('movieId');
  }

  async findOne(filter: any): Promise<ShowTimeDocument | null> {
    const showTime = await this.showTimeModel
      .findOne(
        filter,
        Object.keys(this.showTimeModel.schema.obj)
          .map((key) => key)
          .join(' '),
      )
      .populate('movieId')
      .exec();
    if (!showTime) {
      throw new NotFoundException(`ShowTime not found.`);
    }
    return showTime;
  }

  async update(
    id: string,
    updateShowTimeDto: UpdateShowTimeDto,
  ): Promise<ShowTime> {
    const updatedShowTime = await this.showTimeModel
      .findByIdAndUpdate(id, updateShowTimeDto, { new: true })
      .exec();
    if (!updatedShowTime) {
      throw new NotFoundException(`ShowTime with ID '${id}' not found.`);
    }
    return updatedShowTime;
  }

  async remove(movieId: string, id: string): Promise<{ deleted: boolean }> {
    const result = await this.showTimeModel
      .deleteOne({ _id: id, movieId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`ShowTime with ID '${id}' not found.`);
    }
    return { deleted: true };
  }
}
