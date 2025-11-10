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
        name: 'TRANSFORMER_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transformer-producer',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
      {
        name: 'TRANSFORMER_REPLY',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transformer-reply',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transformer-reply-group',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppManager, AppService],
})
export class AppModule {}