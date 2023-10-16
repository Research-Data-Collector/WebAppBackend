// admin.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let adminController: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  // Write more test cases for your AdminController methods here
  it('should create an organization', async () => {
    // Define a test organization data
    const organizationData = {email:'upeksha434Qgmail.com', orgname:'test' };
    // Call the create organization method and make assertions
    const result = await adminController.organization(organizationData);
    expect(result).toBeDefined();
  });

  it('should add members', async () => {
    // Define test member data
    const addMembersData = {userId:1, orgId:1, status:true};
    // Call the add members method and make assertions
    const result = await adminController.addMembers(addMembersData);
    expect(result).toBeDefined();
  });

  // More test cases for other AdminController methods
});

// // auth.controller.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// describe('AuthController', () => {
//   let authController: AuthController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [AuthService],
//     }).compile();

//     authController = module.get<AuthController>(AuthController);
//   });

//   it('should be defined', () => {
//     expect(authController).toBeDefined();
//   });

//   // Write more test cases for your AuthController methods here
//   it('should register a user', async () => {
//     // Define a test user registration data
//     const registerData = { /*... */ };
//     // Call the register method and make assertions
//     const result = await authController.register(registerData);
//     expect(result).toBeDefined();
//   });

//   it('should log in a user', async () => {
//     // Define test login data
//     const loginData = { /*... */ };
//     // Call the login method and make assertions
//     const result = await authController.login(loginData);
//     expect(result).toBeDefined();
//   });

//   // More test cases for other AuthController methods
// });
