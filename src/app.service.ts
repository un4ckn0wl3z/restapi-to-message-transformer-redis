// app.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    // ✅ Subscribe ไว้ล่วงหน้า (เรียกครั้งเดียว)
    this.kafka.subscribeToResponseOf('test.request.topic');
    await this.kafka.connect();
  }

  async testTransform(data: any): Promise<any> {
    const correlationId = uuidv4();

    // ❌ ไม่ต้องสร้าง replyTopic ใหม่ทุกครั้ง
    // ✅ NestJS จะจัดการ replyTopic ให้เอง (เช่น test.request.topic.reply)
    const response$ = this.kafka.send('test.request.topic', {
      correlationId,
      payload: data,
    });

    return firstValueFrom(response$);
  }
}
