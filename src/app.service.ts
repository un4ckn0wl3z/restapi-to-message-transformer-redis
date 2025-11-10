// app.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSFORMER_PRODUCER') private readonly producer: ClientKafka,
    @Inject('TRANSFORMER_REPLY') private readonly replyClient: ClientKafka,
  ) {}

  async testTransform(data: any): Promise<any> {
    const correlationId = uuidv4();
    const replyTopic = `reply.${correlationId}`;

    // ต้อง subscribe ก่อน send
    this.replyClient.subscribeToResponseOf('test.request.topic');

    const response$ = this.producer.send('test.request.topic', {
      correlationId,
      replyTopic,
      payload: data,
    });

    return await firstValueFrom(response$);
  }
}