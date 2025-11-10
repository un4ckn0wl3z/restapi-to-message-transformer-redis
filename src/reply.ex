// transformer.service.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller()
export class TransformerController {
  
  @EventPattern('test.request.topic') // ใช้ EventPattern ได้เลย!
  async handleTransform(@Payload() message: any, @Ctx() context: KafkaContext) {
    const { correlationId, replyTopic, payload } = message;

    console.log('Received transform request:', payload.header?.session);

    // ทำ transform จริง
    const result = {
      transformed: payload.data?.toUpperCase?.() || 'DONE',
      session: payload.header?.session,
      timestamp: new Date().toISOString(),
    };

    // ส่ง reply กลับไปที่ replyTopic (สำคัญ!)
    const producer = context.getProducer();
    producer.send({
      topic: replyTopic,
      messages: [
        {
          key: correlationId,
          value: JSON.stringify(result),
        },
      ],
    });

    // ไม่ต้อง return อะไร → เพราะเราใช้ EventPattern
  }
}