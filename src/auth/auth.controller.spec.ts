import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Write more test cases for your AuthController methods here
  it('should register a user', async () => {
    // Define a test user registration data
    const registerData = { fname:'test', lname:'test', email:'test@gmail.com',password:'test7897@#TT', roleId:2 };
    // Call the register method and make assertions
    const result = await authController.register(registerData);
    expect(result).toBeDefined();
  });

  it('should log in a user', async () => {
    // Define test login data
    const loginData = { email:'test@gmail.com',password:'test7897@#TT', roleId:2};
    // Call the login method and make assertions
    const result = await authController.login(loginData);
    expect(result).toBeDefined();
  });

  // More test cases for other AuthController methods
});