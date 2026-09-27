import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { UsuarioAutenticado } from '../auth/interfaces/usuario-autenticado.interface';
import { garantirDonoOuAdmin } from '../auth/garantir-dono-ou-admin';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}


  async listarPorUsuario(
    idUsuario: number,
    solicitante: UsuarioAutenticado,
  ) {
    try {
      garantirDonoOuAdmin(solicitante, idUsuario);

      return await this.prisma.address.findMany({
        where: { idUsuario },
        orderBy: { id: 'asc' },
      });
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Usuario ${idUsuario} nao encontrado`,
        );
      }

      throw erro;
    }
  }


  async atualizar(
    id: number,
    dto: UpdateAddressDto,
    solicitante: UsuarioAutenticado,
  ) {
    const endereco = await this.buscarOuFalhar(id);

    garantirDonoOuAdmin(solicitante, endereco.idUsuario);

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  private async buscarOuFalhar(id: number) {
    const endereco = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!endereco) {
      throw new NotFoundException(
        `Endereco ${id} nao encontrado`,
      );
    }

    return endereco;
  }
}


