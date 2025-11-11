// app.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly requestTopic = 'test.request.topic';
  private readonly replyTopic = 'test.reply.topic'; // ✅ ใช้ topic ที่ register ไว้แล้ว

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    // ✅ subscribe ไว้ล่วงหน้าเฉพาะ reply topic (เพราะเรารู้ชื่อแน่นอน)
    this.kafka.subscribeToResponseOf(this.replyTopic);
    await this.kafka.connect();
  }

async testTransform(data: any): Promise<any> {
  const correlationId = uuidv4();

  const response$ = this.kafka.send(
    this.requestTopic,
    {
      value: {
        correlationId,
        payload: data,
      },
      headers: {
        'reply-topic': this.replyTopic,
        'correlation-id': correlationId,
      },
    }
  );

  return firstValueFrom(response$);
}
}
