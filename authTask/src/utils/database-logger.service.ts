import { Injectable } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class DatabaseLoggerService {
  /**
   * Log database connection events
   */
  logConnection(connectionName: string, uri: string): void {
    // Mask the connection string to hide credentials
    const maskedUri = this.maskConnectionString(uri);
    logger.info(`Database connection established: ${connectionName}`, { connectionName, uri: maskedUri });
  }

  /**
   * Log database disconnection events
   */
  logDisconnection(connectionName: string): void {
    logger.warn(`Database disconnected: ${connectionName}`, { connectionName });
  }

  /**
   * Log database errors
   */
  logError(connectionName: string, error: any): void {
    logger.error(`Database error: ${connectionName}`, {
      connectionName,
      errorMessage: error.message,
      errorName: error.name,
      errorCode: error.code,
      stack: error.stack,
    });
  }

  /**
   * Log database query performance
   */
  logQuery(operation: string, collectionName: string, duration: number, filter?: any): void {
    // Log slow queries with warning level
    if (duration > 100) { // More than 100ms is considered slow
      logger.warn(`Slow database query: ${operation} on ${collectionName} took ${duration}ms`, {
        operation,
        collectionName,
        duration,
        filter: this.sanitizeFilter(filter),
      });
    } else {
      logger.debug(`Database query: ${operation} on ${collectionName} took ${duration}ms`, {
        operation,
        collectionName,
        duration,
        filter: this.sanitizeFilter(filter),
      });
    }
  }

  /**
   * Mask sensitive information in connection strings
   */
  private maskConnectionString(uri: string): string {
    if (!uri) return '';
    try {
      // Replace username:password with ***:*** in MongoDB connection string
      return uri.replace(/(\/\/[^:]+:)[^@]+@/, '$1***@');
    } catch (error) {
      return 'Invalid connection string';
    }
  }

  /**
   * Sanitize query filters to remove sensitive data
   */
  private sanitizeFilter(filter: any): any {
    if (!filter) return {};
    
    const sanitized = { ...filter };
    
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