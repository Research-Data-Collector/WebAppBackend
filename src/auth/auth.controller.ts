import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    usersService: any;
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


    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // async profile(@Request() req) {
    //     return req.user;
    // }

    // @Get(':id')
    // getUser(@Param('id',ParseIntPipe) id:number){
    //     const user=this.authService.getUser(id)
    //     if(!user){
    //         throw new HttpException('User not found',HttpStatus.BAD_GATEWAY);
    //     }
    //     return user;
    // }

    @Get(':email')
    getUser(@Param('email') email:string){
        const user=this.authService.getUser(email)
        if(!user){
            throw new HttpException('User not found',HttpStatus.BAD_GATEWAY);
        }
        return user;
    }



}
