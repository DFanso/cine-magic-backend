import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';
import { PaymentStatus } from 'src/Types/booking.types';

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the movie',
    example: '507f1f77bcf86cd799439012',
  })
  movieId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the show time',
    example: '507f1f77bcf86cd799439013',
  })
  showTimeId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of selected seat identifiers',
    example: ['A1', 'A2', 'B1'],
  })
  selectedSeats: number[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Total price for the booking', example: 29.99 })
  totalPrice: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'PayPal payment ID',
    example: 'PAYID-LKLKJDAJ12345',
    default: 'PAYID-LKLKJDAJ12345',
  })
  paypalPaymentId: string;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: PaymentStatus,
    description: 'Payment status',
    example: PaymentStatus.Unpaid,
  })
  paymentStatus: PaymentStatus;
}
