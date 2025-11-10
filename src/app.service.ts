// app.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async testTransform(data: any): Promise<any> {
    const correlationId = uuidv4();
    const replyTopic = `reply.${correlationId}`;

    // สำคัญ: ต้อง subscribe ก่อน send ครั้งแรก
    // เรียกครั้งเดียวพอ (NestJS cache ให้)
    this.kafka.subscribeToResponseOf('test.request.topic');

    const response$ = this.kafka.send('test.request.topic', {
      correlationId,
      replyTopic,
      payload: data,
    });

    return firstValueFrom(response$);
  }
}