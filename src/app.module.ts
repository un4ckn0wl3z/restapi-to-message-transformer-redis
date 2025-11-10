// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppManager } from './app.manager';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT', // ตัวเดียวจบ
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-group', // ต้องมี consumer เพื่อรับ reply
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppManager, AppService],
})
export class AppModule {}