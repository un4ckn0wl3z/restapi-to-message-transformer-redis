// transform.consumer.ts
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Controller()
export class TransformConsumer {
  private readonly kafkaProducer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'transform-service',
      brokers: ['localhost:9092'],
    });
    this.kafkaProducer = kafka.producer();
    this.kafkaProducer.connect();
  }

  @EventPattern('test.request.topic')
  async handleTransform(@Payload() message: any, @Ctx() context: KafkaContext) {
    const headers = context.getMessage().headers;
    const replyTopic = headers['reply-topic']?.toString();
    const correlationId = headers['correlation-id']?.toString();

    const { payload } = message;

    const result = {
      success: true,
      transformed: payload?.toUpperCase?.() ?? payload,
    };

    // ✅ ส่งกลับไปยัง replyTopic ที่ client ระบุมา
    if (replyTopic) {
      await this.kafkaProducer.send({
        topic: replyTopic,
        messages: [
          {
            key: correlationId,
            value: JSON.stringify(result),
            headers: {
              'correlation-id': correlationId,
            },
          },
        ],
      });
    }
  }
}
