import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { SignupDto } from '../src/auth/dto/auth.dto';
import { User, UserDocument } from '../src/models/user.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userModel: Model<UserDocument>;
  beforeAll(async () => {
    // Use the actual MongoDB connection configured in the application
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = app.get<AuthService>(AuthService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name, 'auth'));

  
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await app.close();
  });

  describe('AuthService Integration', () => {
    it('should successfully create a new user', async () => {
      // Create a test user
      const signupDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Call the actual service method
      const result = await authService.signup(signupDto);

      // Verify the user was created in the database
      const createdUser = await userModel.findOne({ email: signupDto.email }).exec();
      
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(signupDto.name);
      expect(createdUser.email).toBe(signupDto.email);
      // Password should be hashed, not stored as plaintext
      expect(createdUser.password).not.toBe(signupDto.password);

      // Verify the returned data structure
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('user');
      expect(result.data.user).toHaveProperty('name', signupDto.name);
      expect(result.data.user).toHaveProperty('email', signupDto.email);
    });

    it('should throw an error when trying to create a user with an existing email', async () => {
      // Create a test user
      const signupDto: SignupDto = {
        name: 'Another User',
        email: 'test@example.com', // Same email as previous test
        password: 'AnotherPassword123!',
      };

      // Expect the signup to throw an error
      await expect(authService.signup(signupDto)).rejects.toThrow();
    });
  });

  describe('Auth API Integration', () => {
    it('should register a new user via API', async () => {
      const signupDto: SignupDto = {
        name: 'API Test User',
        email: 'apitest@example.com',
        password: 'ApiPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('name', signupDto.name);
      expect(response.body.data.user).toHaveProperty('email', signupDto.email);

      // Verify the user was created in the database
      const createdUser = await userModel.findOne({ email: signupDto.email }).exec();
      expect(createdUser).toBeDefined();
    });

    it('should return 400 when trying to register with an existing email via API', async () => {
      const signupDto: SignupDto = {
        name: 'Duplicate API User',
        email: 'apitest@example.com', // Same as previous test
        password: 'DuplicatePassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(400); // Bad Request
    });

    it('should login a registered user via API', async () => {
      const loginDto = {
        email: 'apitest@example.com',
        password: 'ApiPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', loginDto.email);
    });

    it('should return 401 when trying to login with invalid credentials', async () => {
      const loginDto = {
        email: 'apitest@example.com',
        password: 'WrongPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401); // Unauthorized
    });
  });
});