// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ยังต้องมีอยู่! เพื่อให้ TRANSFORMER_REPLY เริ่ม consume ได้
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-gateway-hybrid',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transformer-reply-group', // ต้องตรงกับใน module
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);

  console.log(`API Gateway running on port ${process.env.PORT || 3000}`);
}

bootstrap();