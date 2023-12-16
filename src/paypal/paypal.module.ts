import { Module, forwardRef } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { HttpModule } from '@nestjs/axios';
import { BookingModule } from 'src/booking/booking.module';
import { ShowTimesModule } from 'src/show-times/show-times.module';

@Module({
  imports: [HttpModule, forwardRef(() => BookingModule), ShowTimesModule],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
