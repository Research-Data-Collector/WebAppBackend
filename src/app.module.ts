import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
      JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      EMAIL_CONFIRMATION_URL: Joi.string().required(),
      UsersModule, AdminModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  
})
export class AppModule {}
