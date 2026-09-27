import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';

import { CHAVE_ROLES } from './decorators/roles.decorator';

import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const rolesExigidas = this.reflector.getAllAndOverride<string[]>(
      CHAVE_ROLES,
      [
        contexto.getHandler(),
        contexto.getClass(),
      ],
    );

    if (!rolesExigidas?.length) {
      return true;
    }

    const usuario = contexto.switchToHttp().getRequest().user;

    if (!usuario || !rolesExigidas.includes(usuario.role)) {
      throw new ForbiddenException(
        `Esta operacao exige um dos perfis: ${rolesExigidas.join(', ')}`,
      );
    }

    return true;
  }
}

