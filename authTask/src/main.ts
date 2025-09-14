import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { logger } from './utils/logger';

(async ()=> {
  try {
    logger.info('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    
    logger.debug('Configuring CORS...');
    app.enableCors({
      origin: ['http://localhost:5173', 'http://frontend:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });
    
    logger.debug('Configuring global validation pipe...');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    logger.debug('Configuring global exception filter...');
    app.useGlobalFilters(new AllExceptionsFilter());
    
    await app.listen(8080);
    const url = await app.getUrl();
    logger.info(`Application successfully started and is running on: ${url}`);
    
    // Handle application shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT signal. Shutting down gracefully...');
      await app.close();
      logger.info('Application has been shut down.');
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM signal. Shutting down gracefully...');
      await app.close();
      logger.info('Application has been shut down.');
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Error starting application: ${error.message}`, { error });
    process.exit(1);
  }
})()

