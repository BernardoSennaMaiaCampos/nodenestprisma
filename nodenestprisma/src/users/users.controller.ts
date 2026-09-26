import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsuarioAtual } from '../auth/decorators/usuario-atual.decorator';
import { UsuarioAutenticado } from '../auth/interfaces/usuario-autenticado.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE_ADMIN } from '../auth/interfaces/role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { HttpCode, HttpStatus } from '@nestjs/common';


@Controller('user')
export class UsersController {
constructor(private readonly users: UsersService) {}
@Get()
listar() { return this.users.listar(); }
@Get(':id')
buscar(@Param('id', ParseIntPipe) id: number) {
return this.users.buscarPorId(id);
}
@Post()
criar(@Body() dto: CreateUserDto) { return this.users.criar(dto); }
}
@Put(':id')
atualizar(
@Param('id', ParseIntPipe) id: number,
@Body() dto: UpdateUserDto,
@UsuarioAtual() solicitante: UsuarioAutenticado,
) {
return this.users.atualizar(id, dto, solicitante);
}
@Roles(ROLE_ADMIN)
@Delete(':id')
remover(@Param('id', ParseIntPipe) id: number) {
return this.users.remover(id);
}