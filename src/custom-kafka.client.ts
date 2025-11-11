// src/kafka/custom-kafka.client.ts
import { Logger } from '@nestjs/common';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';

export class CustomReplyKafkaClient extends ClientKafka {
  protected readonly logger = new Logger(CustomReplyKafkaClient.name);

  constructor(options: KafkaOptions['options']) {
    super(options);
  }

  /**
   * Override the reply-topic derivation.
   * Default:  pattern + '.reply'
   * Custom:   'replies.<env>.<pattern>'
   */
  protected getResponsePatternName(pattern: string): string {
    const env = process.env.KAFKA_ENV || 'dev';
    const replyTopic = `replies.${env}.${pattern}`;

    this.logger.debug(
      `Pattern "${pattern}" → reply topic "${replyTopic}"`,
    );

    return replyTopic;
  }
}