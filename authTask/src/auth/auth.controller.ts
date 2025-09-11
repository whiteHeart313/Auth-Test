import { Controller, Post, Get, Body, HttpCode, HttpStatus, UsePipes, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import { loginSchema, signupSchema } from './dto/auth.validation';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(signupSchema))
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('get-user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: Request) {
    const user = req.user;
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
    return this.authService.refreshToken(req.user['userId']);
  }
}