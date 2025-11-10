// app.manager.ts
import { Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Injectable()
export class AppManager {
  constructor(private readonly appService: AppService) {}

  async handleTestTransformRequest(request: any, response: Response) {
    try {
      const result = await this.appService.testTransform(request);
      response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: error.message || 'Transform failed' });
    }
  }
}