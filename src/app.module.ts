import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [
    UsersModule, AdminModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  
})
export class AppModule {}
