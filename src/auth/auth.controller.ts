import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

//
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @Post('/test')
    async test() {
        return await this.authService.sendOTPEmail('34567','upeksha434@gmail.com','Upeksha');
    }

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
}
