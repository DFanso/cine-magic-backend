import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body('amount') amount: string, @Res() res) {
    if (!amount) {
      throw new BadRequestException('Amount is required');
    }

    const approvalUrl = await this.paypalService.createOrder(amount);
    res.send({ approvalUrl });
  }
}
