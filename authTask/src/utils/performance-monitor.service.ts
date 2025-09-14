import { Injectable } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class PerformanceMonitorService {
  private metrics: Map<string, PerformanceMetric> = new Map();
  
  /**
   * Start timing an operation
   * @param operationName Name of the operation to time
   * @returns A function to call when the operation is complete
   */
  startTimer(operationName: string): () => void {
    const startTime = process.hrtime();
    
    return () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const durationMs = seconds * 1000 + nanoseconds / 1000000;
      this.recordMetric(operationName, durationMs);
      
      // Log slow operations
      if (durationMs > 1000) { // More than 1 second is considered slow
        logger.warn(`Slow operation detected: ${operationName} took ${durationMs.toFixed(2)}ms`);
      } else {
        logger.debug(`Operation timing: ${operationName} took ${durationMs.toFixed(2)}ms`);
      }
    };
  }
  
  /**
   * Record a metric for an operation
   * @param name Name of the metric
   * @param value Value to record
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        total: 0,
        min: value,
        max: value,
        average: value,
      });
    }
    
    const metric = this.metrics.get(name);
    metric.count++;
    metric.total += value;
    metric.min = Math.min(metric.min, value);
    metric.max = Math.max(metric.max, value);
    metric.average = metric.total / metric.count;
  }
  
  /**
   * Get all recorded metrics
   */
  getMetrics(): Record<string, PerformanceMetric> {
    const result: Record<string, PerformanceMetric> = {};
    
    this.metrics.forEach((value, key) => {
      result[key] = { ...value };
    });
    
    return result;
  }
  
  /**
   * Log all current metrics
   */
  logMetrics(): void {
    const metrics = this.getMetrics();
    logger.info('Performance metrics:', { metrics });
  }
  
  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.metrics.clear();
    logger.debug('Performance metrics reset');
  }
}

interface PerformanceMetric {
  count: number;
  total: number;
  min: number;
  max: number;
  average: number;
}