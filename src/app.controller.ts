import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppManager } from './app.manager';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private manager: AppManager,
  ) {}

  @Post("test/transform")
  handleTestTransformRequest(@Body() requestBody: any, @Res() response: Response) {
    this.manager.handleTestTransformRequest(requestBody, response);
  }

}
