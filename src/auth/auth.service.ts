import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class AuthService {




  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async sendOTPEmail(otp: string, email: string, name: string) {
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "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 "

    const apiInstance = new Brevo.TransactionalEmailsApi();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `Common: Your OTP CODE Is ${otp}`;
    sendSmtpEmail.htmlContent = `
      <html>
        <head>
          <title>Common: Your OTP CODE Is ${otp}</title>
        </head>
        <body>
          <h1>Your OTP CODE Is ${otp}</h1>
          <p>Hi ${name},</p>
          <p>Your OTP CODE Is ${otp}</p>
          <p>Thanks</p>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { "name": "SurvayY Platform", "email": "no-reply@survwayy.com" };
    sendSmtpEmail.to = [
      { "email": email, "name": name }
    ];

    sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data:any) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });
  }

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

    // if(checkUserExists.roleId == 1){
    //   const org = await this.prisma.organization.create({
    //     data:{
    //       orgname: "OrgName", /// Get the name from the DTO
    //       adminId: createUser.id
    //     }
    //   });
    // }

    if (createUser) {

      const otp = Math.floor(100000 + Math.random() * 900000);

      // Send Email
      this.sendOTPEmail(otp.toString(), createUser.email, createUser.fname + ' ' + createUser.lname);

      // Create Email Verification Record
      await this.prisma.emailVerifications.create({
        data: {
          otp: otp.toString(),
          userId: createUser.id
        }
      });

      return {
        message: 'Sign Up Successfull!',
      };
    }
  }



  async emailVerification(otp: string, email: string) {
    const checkOtp = await this.prisma.emailVerifications.findFirst({
      where: {
        otp: otp,
        user: {
          email: email
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 5 * 60 * 1000)
        }
      }
    });

    if (!checkOtp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    } else {
      const updateUser = await this.prisma.user.update({
        where: {
          id: checkOtp.userId
        },
        data: {
          isVerified: true
        }
      });

      if (updateUser) {
        return {
          message: 'Email Verified Successfully!'
        }
      }
    }
  }

  //*************************************************************************** */
  //for login

  async login(data: LoginDto): Promise<object> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await compare(
      data.password,
      user.password,
    );

    if (checkPassword) {
      const accessToken = this.generateJWT({
        sub: user.id,
        fname: user.fname,
        email: user.email,
      });

      return {
        user: user,
        accessToken: accessToken,
      };
    } else {
      throw new HttpException(
        'User or password not match',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }


  generateJWT(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired,
    });
  }
}
