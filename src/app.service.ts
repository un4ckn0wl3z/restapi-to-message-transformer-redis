import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @Inject('TRANSFROMER_PRODUCER')
    private readonly eventPublisherClient: ClientKafka,
  ) {
    
  }
  async testTransform(data: any): Promise<any> {
    await this.eventPublisherClient.emit('test.request.topic', data);
  }
}
