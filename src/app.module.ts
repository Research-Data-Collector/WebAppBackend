import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    UsersModule, AdminModule, PrismaModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  
})
export class AppModule {}
