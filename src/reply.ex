// test.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class TestController {
  constructor(private readonly kafka: ClientKafka) {}

  @EventPattern('test.request.topic')
  async handleRequest(@Payload() message: any, @Ctx() context: KafkaContext) {
    const headers = context.getMessage().headers || {};
    const replyTopic = headers['replyTopic']?.toString();
    const correlationId = headers['correlationId']?.toString();

    console.log('📩 Received:', message);
    console.log('🧾 Headers:', headers);

    if (replyTopic && correlationId) {
      const responsePayload = {
        result: `Processed: ${message.payload}`,
      };

      // ✅ manual reply back to client
      await this.kafka.send({
        topic: replyTopic,
        messages: [
          {
            key: correlationId,
            value: JSON.stringify(responsePayload),
            headers: { correlationId },
          },
        ],
      });
      console.log(`✅ Replied to ${replyTopic}`);
    } else {
      console.warn('⚠️ No replyTopic/correlationId — skipping reply');
    }
  }
}
