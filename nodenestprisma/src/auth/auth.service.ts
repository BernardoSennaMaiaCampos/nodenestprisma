import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { DuracaoToken } from './interfaces/duracao-token.type';
import { ROLE_USER } from './interfaces/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioAutenticado } from './interfaces/usuario-autenticado.interface';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { HttpCode, HttpStatus, Post, Body } from '@nestjs/common';

const HASH_FALSO = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.7g3KJx1lqPpVQZVZ4YJ0sOZ4Zq0ZqZq';
@Injectable()
export class AuthService {
constructor(
private readonly users: UsersService,
private readonly jwt: JwtService,
private readonly config: ConfigService,
) {}
async login(dto: LoginDto) {
const usuario = await this.users.buscarPorEmailComSenha(dto.email);
const senhaConfere = await bcrypt.compare(dto.senha, usuario?.senha ?? HASH_FALSO);
if (!usuario || !senhaConfere) {
throw new UnauthorizedException('Email ou senha invalidos');
}
const payload: UsuarioAutenticado = {
sub: usuario.id,
email: usuario.email,
role: usuario.role ?? ROLE_USER,
};
return {
access_token: await this.jwt.signAsync(payload),
token_type: 'Bearer',
expires_in: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
};
}
}