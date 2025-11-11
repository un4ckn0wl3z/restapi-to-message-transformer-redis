// app.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, of, timeout } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly requestTopic = 'test.request.topic';

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    // ✅ subscribe ไว้ล่วงหน้าเฉพาะ reply topic (เพราะเรารู้ชื่อแน่นอน)
    console.log("Subscribing to requestTopic topic: ", this.requestTopic);
    this.kafka.subscribeToResponseOf(this.requestTopic);
    await this.kafka.connect();
  }

async testTransform(data: any): Promise<any> {
  console.log(`Sending request with correlationId: ${this.requestTopic}`);

  const response$ = await firstValueFrom(this.kafka.send(
    this.requestTopic,
    {
      test: 'transform',
    }
  ));

  console.log("Response Observable: ", response$);
  return response$;
}
}
 