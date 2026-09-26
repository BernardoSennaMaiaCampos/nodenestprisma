import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { DuracaoToken } from './interfaces/duracao-token.type';
import { RolesGuard } from './guards/roles.guard';
import { Public } from './decorators/public.decorator';


@Module({
imports: [
UsersModule,
JwtModule.registerAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (config: ConfigService): JwtModuleOptions => ({
secret: config.getOrThrow<string>('JWT_SECRET'),
signOptions: {
expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as DuracaoToken,
},
}),
}),
],
controllers: [AuthController],
providers: [
AuthService,
{ provide: APP_GUARD, useClass: JwtAuthGuard },
],
})
export class AuthModule {
  { provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_GUARD, useClass: RolesGuard },
}
