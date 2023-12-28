import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { ShowTimesService } from '../show-times/show-times.service';
import { PaypalService } from '../paypal/paypal.service';
import { MoviesService } from '../movies/movies.service';
import { Types } from 'mongoose';
import { PaymentStatus } from '../Types/booking.types';
import { getModelToken } from '@nestjs/mongoose';
import { Booking } from './entities/booking.entity';

describe('BookingService', () => {
  let service: BookingService;

  const mockBooking = {
    _id: new Types.ObjectId(),
    userId: 'someUserId',
    movieId: 'someMovieId',
    showTimeId: 'someShowTimeId',
    selectedSeats: [4, 5, 6],
    totalPrice: 30,
    paypalPaymentId: 'paypal123',
    paymentStatus: PaymentStatus.Paid,
  };

  beforeEach(async () => {
    const mockBookingModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockBooking),
    }));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: ShowTimesService,
          useValue: {
            reserveSeatsTemporarily: jest.fn().mockResolvedValue(null),
            findOne: jest.fn().mockResolvedValue({
              // Mock response that matches the structure expected in your service
              _id: 'someShowTimeId',
              price: 10,
            }),
          },
        },
        {
          provide: PaypalService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue('approvalUrl'),
          },
        },
        {
          provide: MoviesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ name: 'The Matrix' }),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should create a new booking', async () => {
    // Assuming 'createBookingDto' is an instance of 'CreateBookingDto'
    const createBookingDto = {
      userId: 'someUserId',
      movieId: 'someMovieId',
      showTimeId: 'someShowTimeId',
      selectedSeats: [4, 5, 6],
      totalPrice: 30,
      paypalPaymentId: 'paypal123',
      paymentStatus: PaymentStatus.Paid,
    };
  
    const result = await service.create(createBookingDto);
    expect(result.booking).toEqual(mockBooking);
    expect(result.approvalUrl).toBe('approvalUrl');
  });
});
