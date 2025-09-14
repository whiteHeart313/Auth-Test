import { Injectable } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class SecurityLoggerService {
  /**
   * Log authentication attempts
   */
  logAuthAttempt(email: string, success: boolean, ip: string, userAgent: string) {
    const logLevel = success ? 'info' : 'warn';
    const message = success ? 'Successful authentication' : 'Failed authentication attempt';
    
    logger[logLevel](message, {
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log password changes
   */
  logPasswordChange(userId: string, success: boolean, ip: string) {
    const logLevel = success ? 'info' : 'warn';
    const message = success ? 'Password changed successfully' : 'Password change failed';
    
    logger[logLevel](message, {
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log account lockouts
   */
  logAccountLockout(userId: string, email: string, reason: string, ip: string) {
    logger.warn('Account locked', {
      userId,
      email,
      reason,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log suspicious activities
   */
  logSuspiciousActivity(userId: string, activity: string, details: Record<string, any>, ip: string) {
    logger.warn('Suspicious activity detected', {
      userId,
      activity,
      details,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log permission changes
   */
  logPermissionChange(userId: string, targetUserId: string, permissions: string[], action: 'grant' | 'revoke') {
    logger.info('Permission change', {
      userId, // User making the change
      targetUserId, // User whose permissions are being changed
      permissions,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log security configuration changes
   */
  logSecurityConfigChange(userId: string, setting: string, oldValue: any, newValue: any) {
    logger.info('Security configuration changed', {
      userId,
      setting,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
    });
  }
}