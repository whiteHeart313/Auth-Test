import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../models/user.model';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';
import { logger } from '../utils/logger';
import { PerformanceMonitorService } from '../utils/performance-monitor.service';
import { SecurityLoggerService } from '../utils/security-logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'auth') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private performanceMonitor: PerformanceMonitorService,
    private securityLogger: SecurityLoggerService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const endTimer = this.performanceMonitor.startTimer('auth.signup');
    const { name, email, password } = signupDto;
    logger.info(`Signup attempt for email: ${email}`);

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      logger.warn(`Signup failed: Email already exists: ${email}`);
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      logger.info(`User created successfully: ${email}`);
      
      const accessToken = this.generateToken(newUser);
      logger.debug(`Access token generated for user: ${email}`);
      
      const result = {
        data: {
          accessToken,
          user: {
            name: newUser.name,
            email: newUser.email,
          },
        },
      };
      
      endTimer();
      return result;
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`, { error });
      throw error;
    }
  }

  async login(loginDto: LoginDto, ip: string = 'unknown', userAgent: string = 'unknown'): Promise<AuthResponseDto> {
    const endTimer = this.performanceMonitor.startTimer('auth.login');
    const { email, password } = loginDto;
    logger.info(`Login attempt for email: ${email}`);

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      this.securityLogger.logAuthAttempt(email, false, ip, userAgent);
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email: ${email}`);
      this.securityLogger.logAuthAttempt(email, false, ip, userAgent);
      throw new BadRequestException('Invalid email or password');
    }

    logger.info(`User logged in successfully: ${email}`);
    const accessToken = this.generateToken(user);
    logger.debug(`Access token generated for user: ${email}`);
    this.securityLogger.logAuthAttempt(email, true, ip, userAgent);

    const result = {
      data: {
        accessToken,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    };
    
    endTimer();
    return result;
  }

  async validateUserById(userId: string): Promise<UserDocument | null> {
    const endTimer = this.performanceMonitor.startTimer('auth.validateUserById');
    logger.debug(`Validating user by ID: ${userId}`);
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      logger.warn(`User validation failed: User not found for ID: ${userId}`);
    } else {
      logger.debug(`User validated successfully: ${user.email}`);
    }
    endTimer();
    return user;
  }

  async refreshToken(userId: string): Promise<{ data: { accessToken: string } }> {
    const endTimer = this.performanceMonitor.startTimer('auth.refreshToken');
    logger.info(`Token refresh attempt for user ID: ${userId}`);
    
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      logger.warn(`Token refresh failed: User not found for ID: ${userId}`);
      throw new UnauthorizedException('Invalid token');
    }
    
    const accessToken = this.generateToken(user);
    logger.info(`Token refreshed successfully for user: ${user.email}`);
    
    const result = {
      data: {
        accessToken,
      },
    };
    
    endTimer();
    return result;
  }

  private generateToken(user: UserDocument): string {
    const endTimer = this.performanceMonitor.startTimer('auth.generateToken');
    logger.debug(`Generating JWT token for user: ${user.email}`);
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
    };
    const token = this.jwtService.sign(payload);
    endTimer();
    return token;
  }
}