import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BookingService } from 'src/booking/booking.service';
import { PaymentStatus } from 'src/Types/booking.types';
import { ShowTimesService } from 'src/show-times/show-times.service';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly bookingService: BookingService,
    private readonly showTimeService: ShowTimesService,
  ) {}

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received PayPal webhook:', body);
    const bookingId = body.resource.purchase_units[0].custom_id.toString();

    // Process the webhook data based on the event type
    // Example: Check if it's a payment capture event
    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const booking = await this.bookingService.findOne(bookingId);
      const showTimeId = booking.showTimeId.toString();
      const showTime = await this.showTimeService.findById(showTimeId);

      booking.paymentStatus = PaymentStatus.Paid;
      booking.paypalPaymentId = body.id;
      const newlyBookedSeats = booking.selectedSeats;

      // Construct the update query
      const updateQuery = {
        $push: {
          'Seats.bookedSeats': {
            $each: newlyBookedSeats,
          },
        },
      };

      // Execute the raw MongoDB update query
      await this.showTimeService
        .getCollection()
        .updateOne({ _id: showTime._id }, updateQuery);

      await booking.save();
      await showTime.save();
    }

    console.log('bookingID: ' + bookingId);

    // Send a 200 response to acknowledge receipt of the webhook
    return res.status(HttpStatus.OK).send('Webhook received');
  }
}
