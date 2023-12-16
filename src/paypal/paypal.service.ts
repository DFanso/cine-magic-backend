import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private paypalClient: paypal.core.PayPalHttpClient;

  constructor(private configService: ConfigService) {
    const environment = new paypal.core.SandboxEnvironment(
      this.configService.get('PAYPAL_CLIENT_ID'),
      this.configService.get('PAYPAL_CLIENT_SECRET'),
    );
    this.paypalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(amount: string): Promise<string> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: 'http://localhost:3000',
        cancel_url: 'http://your-cancel-url.com',
      },
    });

    try {
      const response = await this.paypalClient.execute(request);
      const order = response.result;

      const approvalUrl = order.links.find(
        (link) => link.rel === 'approve',
      ).href;
      return approvalUrl;
    } catch (err) {
      throw new Error(`Error creating PayPal order: ${err.message}`);
    }
  }
}
