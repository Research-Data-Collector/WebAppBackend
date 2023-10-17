import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async enableShutdownHooks(app: INestApplication) { //The beforeExit hook runs when Prisma is triggered externally (e.g. via a SIGINT signal) to shut down, and allows you to run code before Prisma Client disconnects
    process.on('beforeExit', () => {
      app.close();
    });
  }
}