import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import { logger } from '../utils/logger';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    logger.info(`Signup endpoint called for email: ${signupDto.email}`);
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() ip: string, @Req() req): Promise<AuthResponseDto> {
    logger.info(`Login endpoint called for email: ${loginDto.email}`);
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Get('get-user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: Request) {
    const user = req.user;
    logger.info(`Get user endpoint called for user: ${user['email']}`);
    return {
      data: {
        user: {
          name: user['name'],
          email: user['email'],
        },
      },
    };
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req: Request) {
    logger.info(`Refresh token endpoint called for user ID: ${req.user['userId']}`);
    return this.authService.refreshToken(req.user['userId']);
  }
}