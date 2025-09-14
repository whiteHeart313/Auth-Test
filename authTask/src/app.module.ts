import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { DatabaseLoggerService } from './utils/database-logger.service';
import { PerformanceMonitorService } from './utils/performance-monitor.service';
import { SecurityLoggerService } from './utils/security-logger.service';
import { logger } from './utils/logger';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-task';
        const connectionName = 'auth';
        
        return {
          uri,
          connectionName,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.info(`MongoDB connected: ${connectionName}`);
            });
            
            connection.on('disconnected', () => {
              logger.warn(`MongoDB disconnected: ${connectionName}`);
            });
            
            connection.on('error', (error) => {
              logger.error(`MongoDB connection error: ${error.message}`, { error });
            });
            
            return connection;
          },
        };
      },
    }),
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseLoggerService, PerformanceMonitorService, SecurityLoggerService],
  exports: [DatabaseLoggerService, PerformanceMonitorService, SecurityLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
