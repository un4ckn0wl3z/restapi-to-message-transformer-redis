import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AppService } from "./app.service";
import { Response } from 'express';
import { RedisEventEmitter } from "./redis-event-emitter.service";

@Injectable()
export class AppManager {
  constructor(
    private readonly appService: AppService,
    private readonly redisEventEmitter: RedisEventEmitter,
  ) {}

  async handleTestTransformRequest(request: any, response: Response): Promise<any> {
    try {
      const sessionId = request.header.session;

      // Start listening for response BEFORE triggering the job
      const ackPromise = this.redisEventEmitter.once(sessionId, 30000); // 30s timeout

      // Trigger the transformation (this will publish to queue or call microservice)
      await this.appService.testTransform(request);

      // Wait for acknowledgment from transformer service
      const ack = await ackPromise;

      console.log("Received ack from transformer service: ", ack);
      return response.status(200).json(ack);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}