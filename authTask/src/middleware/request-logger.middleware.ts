import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = req.user ? req.user['userId'] : 'unauthenticated';
    
    // Log the request
    logger.info(`Incoming request: ${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      ip,
      userAgent,
      userId,
      query: this.sanitizeData(req.query),
      body: this.sanitizeData(req.body),
    });

    // Track response time
    const startTime = Date.now();

    // Log the response when finished
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      
      // Log based on status code
      if (statusCode >= 500) {
        logger.error(`Response: ${statusCode} ${method} ${originalUrl} - ${responseTime}ms`, {
          statusCode,
          responseTime,
          method,
          url: originalUrl,
        });
      } else if (statusCode >= 400) {
        logger.warn(`Response: ${statusCode} ${method} ${originalUrl} - ${responseTime}ms`, {
          statusCode,
          responseTime,
          method,
          url: originalUrl,
        });
      } else {
        logger.info(`Response: ${statusCode} ${method} ${originalUrl} - ${responseTime}ms`, {
          statusCode,
          responseTime,
          method,
          url: originalUrl,
        });
      }

      // Log slow responses
      if (responseTime > 1000) {
        logger.warn(`Slow response detected: ${method} ${originalUrl} - ${responseTime}ms`, {
          responseTime,
          method,
          url: originalUrl,
        });
      }
    });

    next();
  }

  // Helper method to sanitize sensitive data
  private sanitizeData(data: any): any {
    if (!data) return {};
    
    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}