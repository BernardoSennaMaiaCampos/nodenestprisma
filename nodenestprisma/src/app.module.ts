import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
providers: [{ provide: APP_FILTER, useClass: PrismaExceptionFilter }],
cache: true,
validate: validateEnv,
}),
PrismaModule,
HealthModule,
UsersModule,
AuthModule,
AddressesModule,
ContactsModule,
],
})
export class AppModule {}