// redis-event-emitter.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisEventEmitter implements OnModuleInit, OnModuleDestroy {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;

  constructor() {
    this.publisher = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.subscriber = this.publisher.duplicate();
  }

  async onModuleInit() {
    await this.publisher.connect();
    await this.subscriber.connect();
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }

  // Emit event
  emit(channel: string, data: any) {
    return this.publisher.publish(channel, JSON.stringify(data));
  }

  // Listen once (perfect for request-response pattern)
  once(channel: string, timeoutMs = 30000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.subscriber.unsubscribe(channel);
        reject(new Error('Event timeout'));
      }, timeoutMs);

      this.subscriber.subscribe(channel, (message) => {
        clearTimeout(timer);
        this.subscriber.unsubscribe(channel);
        try {
          resolve(JSON.parse(message));
        } catch (err) {
          resolve(message); // in case it's not JSON
        }
      });
    });
  }

  // Listen continuously (for background listeners)
  on(channel: string, callback: (data: any) => void) {
    this.subscriber.subscribe(channel, (message) => {
      try {
        callback(JSON.parse(message));
      } catch {
        callback(message);
      }
    });
  }
}