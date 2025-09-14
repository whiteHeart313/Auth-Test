// all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Log the error with your existing logger
    logger.error('Error occurred:', {
      message: exception instanceof Error ? exception.message : 'Unknown error',
      stack: exception instanceof Error ? exception.stack : undefined,
      url: request.url,
      method: request.method,
      ip: request.ip,
    });
    
    // Handle specific error types
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }
    
    // JWT errors
    if (exception instanceof Error) {
      if (exception.name === 'JsonWebTokenError') {
        return response.status(401).json({ message: 'Invalid token' });
      }
      
      if (exception.name === 'TokenExpiredError') {
        return response.status(401).json({ message: 'Token expired' });
      }
      
      // Validation errors
      if (exception.name === 'ValidationError') {
        return response.status(400).json({ message: exception.message });
      }
    }
    
    // Default error response
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : exception instanceof Error ? exception.message : 'Unknown error',
    });
  }
}