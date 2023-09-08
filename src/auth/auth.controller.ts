import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrgDto, RegisterDto, ValidationDto } from './dto/register.dto';
import { ForgetPasswordDto, LoginDto, ResetDataDto, ValidationPasswordDto } from './dto/login.dto';

//
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async register(@Body() data: RegisterDto) {
        return await this.authService.register(data);
    }

    //************************************** */
    //for login

    @Post('login')
    async login(@Body() data: LoginDto) {
        return await this.authService.login(data);
    }


    @Post('verify')
    async verify(@Body() data: ValidationDto) {
        return await this.authService.emailVerification(data['otp'], data['email']);
    }
    
    @Post('login/resetpassword')
    async resetpassword(@Body() forgetPasswordDto:ForgetPasswordDto) {
        return await this.authService.forgetPassword(forgetPasswordDto);
    }
    
    @Post('login/resetpassword/OTP')
    async resetpasswordOTP(@Body() data: ValidationPasswordDto) {
        return await this.authService.passwordOtpVerification(data['otp'], data['email']);
    }

    @Post('login/resetpassword/new/:email')
    async resetpasswordNew(@Param('email') email:string,@Body() resetData: ResetDataDto) {
        return await this.authService.resetPassword(resetData, email);
    }
    
}
