import { Injectable } from '@nestjs/common';


@Injectable()
export class NotificationConsumerService {
  async Notify(data: any) {
    console.log('🔔 New Subscription Created:', data);
    //send the mail to the user
    // User NODE MAILER OR Twillio
    await sleep(4000)
  }
}
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}