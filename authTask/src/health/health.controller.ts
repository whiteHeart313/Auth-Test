import { Controller, Get } from '@nestjs/common';
import { logger } from '../utils/logger';
import { PerformanceMonitorService } from '../utils/performance-monitor.service';
import * as os from 'os';

@Controller('health')
export class HealthController {
  constructor(private performanceMonitor: PerformanceMonitorService) {}

  @Get()
  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    system?: any;
    performance?: any;
    error?: string;
  }> {
    const endTimer = this.performanceMonitor.startTimer('health.check');
    
    try {
      // Collect system metrics
      const systemInfo = this.getSystemInfo();
      
      // Log health check
      logger.info('Health check performed', { systemInfo });
      
      // Get performance metrics
      const performanceMetrics = this.performanceMonitor.getMetrics();
      
      const result = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        system: systemInfo,
        performance: performanceMetrics,
      };
      
      endTimer();
      return result;
    } catch (error) {
      logger.error('Health check failed', { error });
      endTimer();
      
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
  
  @Get('reset-metrics')
  resetMetrics() {
    this.performanceMonitor.resetMetrics();
    logger.info('Performance metrics reset');
    
    return {
      status: 'ok',
      message: 'Performance metrics reset successfully',
      timestamp: new Date().toISOString(),
    };
  }
  
  private getSystemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    return {
      uptime: process.uptime(),
      memory: {
        total: this.formatBytes(totalMemory),
        free: this.formatBytes(freeMemory),
        used: this.formatBytes(usedMemory),
        usedPercentage: Math.round((usedMemory / totalMemory) * 100),
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg(),
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname(),
      },
      process: {
        pid: process.pid,
        version: process.version,
        memoryUsage: this.formatBytes(process.memoryUsage().rss),
      },
    };
  }
  
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}