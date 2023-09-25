import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateOrgDto, RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt';
import { LoginDto, ResetDataDto,ForgetPasswordDto } from './dto/login.dto';
import { User } from '@prisma/client';

import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class AuthService {




  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async sendOTPEmail(otp: string, email: string, name: string,end:string) {
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = " "

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
          <p>${end}</p>
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

    //   let getOrgname:CreateOrgDto;

    //   const org = await this.prisma.organization.create({
    //     data:{
    //       orgname: getOrgname.orgname, /// Get the name from the DTO
    //       adminId: createUser.id
    //     }
    //   });
    // }

    if (createUser) {

      const otp = Math.floor(100000 + Math.random() * 900000);

      // Send Email
      
      const end:string="This is OTP for email verification."+"\n"+"Pleses verify your email address to complete your registration."
      this.sendOTPEmail(otp.toString(), createUser.email, createUser.fname + ' ' + createUser.lname,end);

      // Create Email Verification Record
      await this.prisma.emailVerifications.create({//emailVerifications is the table name
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
    //need a function for resending the OTP
  }

  //*************************************************************************** */
  //for login

  async login(data: LoginDto): Promise<object> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        isVerified: true
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

    //get the email address to send the OTP
    //check the email address prevails in database or not
    //if yes send OTP 
    //else disply "enter a correct email address"

  async forgetPassword(forgetPasswordDto:ForgetPasswordDto) {
    //let user enter the email address
    const checkUserExists= await this.prisma.user.findFirst({
      where:{
        email:forgetPasswordDto.email,
      }
    });
    console.log(checkUserExists);
    if(!checkUserExists){
      throw new HttpException('Email does not exists. Enter a valid email...', HttpStatus.UNAUTHORIZED)
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Send Email
      
    const end:string="This is OTP for Password Reset."+"\n"+"Pleses enter the OTP to change Password."
    this.sendOTPEmail(otp.toString(), forgetPasswordDto.email, checkUserExists.fname + ' ' + checkUserExists.lname,end);
    
    //create passwordOTP verification Record
    await this.prisma.forgetPassword.create({
      data:{
        otp:otp.toString(),
        userId:checkUserExists.id
      }
    });
    return{
      message:'UI should direct to the OTP verification page',
    };
  }


  async passwordOtpVerification(otp:string,email:string){
    const currentuser = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    const checkOtp = await this.prisma.forgetPassword.findFirst({
      where: {
        otp: otp,
        user: {
          email: email,
          isVerified:true,
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 5 * 60 * 1000)
        }
      }
    });

    if(!checkOtp){
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }
    else if(!currentuser.isVerified){
    //let user change the password
      throw new HttpException('Email is not verified', HttpStatus.UNAUTHORIZED);
      //should be directed to the email verification page where he can request new OTP
      //need a function for resending the OTP
    }
    else{
      //let user change the password
      //direct to the change password pagefunction
      await this.prisma.forgetPassword.update({
        where:{
          id:checkOtp.id
        },
        data:{
          isRequested:true
        }
      })


  }
  return{
    message:'UI should direct to the new password page',
  }
  
}

async resetPassword(resetData: ResetDataDto,email:string){
  const currentuser = await this.prisma.user.findFirst({
    where: {
      email: email,
    },

  })

  const time = new Date(new Date().getTime() - 60 * 60 * 1000); //gives 60mins before current time
  
  const requested = await this.prisma.forgetPassword.findFirst({
    where:{
      userId:currentuser.id,
      isRequested:true,
      //entered the OTP, isRequested is true. But password reset time expired
      //change the isRequested to completed
      //direct to login page and request for new OTP
      ////????????? is this correct?
      createdAt: {
        gte: new Date(new Date().getTime() - 60 * 60 * 1000) //check the time expired or not
      }
    }
  });

  // check whether the token is expired or not
  if(!requested){
    //delete the Record
    await this.prisma.forgetPassword.delete({
      where:{
        userId:currentuser.id,
      },
    });

    // await this.prisma.forgetPassword.update({
    //   where:{
    //     userId:currentuser.id,
    //   },
    //   data:{isRequested:'COMPLETED'}

   
    throw new HttpException('Time expired', HttpStatus.UNAUTHORIZED);

    
      
    }

    const newPasswordHash = await hash(resetData.password, 12);
    await this.prisma.user.update({
        where:{ 
          email:email
        },
        data:{password:newPasswordHash}
    });

    //delete the OTP record after password reset
    await this.prisma.forgetPassword.delete({
      where:{
        userId:currentuser.id,
      },
    });
    console.log(currentuser.id)

 

  //   await this.prisma.user.update({
  //     where: {
  //         email: email
  //     }, 
  //     data: { password: newPasswordHash }
  // });

    //console.log(requested,resetData.password,newPasswordHash); 
  return{
    message:'Password Reset Successfull! Login to continue',
  };
  }
}  


//   async updateUser(userData: UserDataUpdate): Promise<object> {

//     const result = await this.prisma.user.update({
//         where: {
//             email: userData.email
//         },
//         data: userData
//     });

//     return result;
// }






