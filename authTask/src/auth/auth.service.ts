import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../models/user.model';
import { LoginDto, SignupDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { name, email, password } = signupDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = this.generateToken(newUser);

    return {
      data: {
        accessToken,
        user: {
          name: newUser.name,
          email: newUser.email,
        },
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken(user);

    return {
      data: {
        accessToken,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    };
  }

  async validateUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async refreshToken(userId: string): Promise<{ data: { accessToken: string } }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    const accessToken = this.generateToken(user);
    
    return {
      data: {
        accessToken,
      },
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}