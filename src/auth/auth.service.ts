import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(data: RegisterDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }
    data.password = await hash(data.password, 12);
    const createUser = await this.prisma.user.create({
      data: data,
    });
    if (createUser) {
      return {
        statusCode: 200,
        message: 'Register Successfull',
      };
    }
  }
  //*************************************************************************** */
  //for login

  async login(data: LoginDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    
    if (!checkUserExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const checkPassword = await compare(
      data.password,
      checkUserExists.password,
    );
      
    if (checkPassword) {
      const accessToken = this.generateJWT({
        sub: checkUserExists.id,
        fname: checkUserExists.fname,
        email: checkUserExists.email,
      });
        
      return {
        statusCode: 200,
        message: 'Login successfull',
        accessToken: accessToken,
      };
    } else {
      throw new HttpException(
        'User or password not match',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

//   async getUser(id:number): Promise<User> {


//     const user = await this.prisma.user.findUnique({
//         where: {
//             id
//         }
//     });

//     if(!user){
//         throw new HttpException('User not found',HttpStatus.UNAUTHORIZED);
//     }

//     return user;
// }

async getUser(email:string): Promise<User> {


    const user = await this.prisma.user.findUnique({
        where: {
            email
        }
    });

    if(!user){
        throw new HttpException('User not found',HttpStatus.UNAUTHORIZED);
    }

    return user;
}


  
  generateJWT(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired,
    });
  }
}
