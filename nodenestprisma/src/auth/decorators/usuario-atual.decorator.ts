import { Reflector } from '@nestjs/core';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioAutenticado } from '../interfaces/usuario-autenticado.interface';

export const UsuarioAtual = createParamDecorator(
(_dados: unknown, contexto: ExecutionContext): UsuarioAutenticado => {
return contexto.switchToHttp().getRequest().user;
},
);
