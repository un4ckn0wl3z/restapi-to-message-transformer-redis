import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the HTTP server instance for REST API
  const app = await NestFactory.create(AppModule);

  // Create Kafka microservice instance
  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Update with your Kafka broker addresses
      },
      consumer: {
        groupId: 'my-consumer-group', // Update with your desired consumer group ID
      },
    },
  });

  // Start the Kafka microservice
  await app.startAllMicroservices();

  // Start the REST API
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
