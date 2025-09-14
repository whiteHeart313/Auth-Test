import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { logger } from '../../utils/logger';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // In production, use environment variables
    });
  }

  async validate(payload: any) {
    logger.debug(`JWT validation: Validating token payload for user ID: ${payload.sub}`);
    
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      logger.warn(`JWT validation failed: Invalid user ID in token: ${payload.sub}`);
      throw new UnauthorizedException();
    }
    
    logger.debug(`JWT validation successful for user: ${payload.email}`);
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}