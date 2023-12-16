import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './entities/booking.entity';
import { ShowTimesService } from 'src/show-times/show-times.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly showTimesService: ShowTimesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);

    const reservationDuration = 1; // minutes
    const reservationExpires = new Date(
      new Date().getTime() + reservationDuration * 60000,
    );

    const savedBooking = await newBooking.save();
    const bookingId = savedBooking._id;

    await this.showTimesService.reserveSeatsTemporarily(
      createBookingDto.showTimeId,
      createBookingDto.selectedSeats.map(Number),
      reservationExpires,
      bookingId,
    );

    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }
    return updatedBooking;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }
  }
}
