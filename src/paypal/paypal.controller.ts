import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@ApiTags('paypal')
@Controller({ path: 'paypal', version: '1' })
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    console.log('Received PayPal webhook:', body);

    // Verify the webhook signature
    const isValid = await this.verifyWebhook(body, res);
    if (!isValid) {
      return res.status(HttpStatus.FORBIDDEN).send('Invalid webhook signature');
    }

    // Process the webhook data based on the event type
    // Example: Check if it's a payment capture event
    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      // Process the order completion event
      // Implement your business logic here
    }

    // Send a 200 response to acknowledge receipt of the webhook
    return res.status(HttpStatus.OK).send('Webhook received');
  }

  private async verifyWebhook(body: any, res: Response): Promise<boolean> {
    const transmissionId = res.get('PAYPAL-TRANSMISSION-ID');
    const transmissionTime = res.get('PAYPAL-TRANSMISSION-TIME');
    const certUrl = res.get('PAYPAL-CERT-URL');
    const authAlgo = res.get('PAYPAL-AUTH-ALGO');
    const transmissionSig = res.get('PAYPAL-TRANSMISSION-SIG');
    const webhookId = this.configService.get('WEBHOOK_ID');

    try {
      const response = await this.httpService
        .post(
          'https://api.paypal.com/v1/notifications/verify-webhook-signature',
          {
            auth_algo: authAlgo,
            cert_url: certUrl,
            transmission_id: transmissionId,
            transmission_sig: transmissionSig,
            transmission_time: transmissionTime,
            webhook_id: webhookId,
            webhook_event: body,
          },
        )
        .toPromise();

      return response.data.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('Error verifying PayPal webhook:', error);
      return false;
    }
  }
}
