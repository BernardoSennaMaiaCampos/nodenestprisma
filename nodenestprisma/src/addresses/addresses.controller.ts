import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UsuarioAutenticado } from '../auth/interfaces/usuario-autenticado.interface';
import { garantirDonoOuAdmin } from '../common/helpers/propriedade';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')

// O parâmetro já é o dono
listarPorUsuario(idUsuario: number, solicitante: UsuarioAutenticado) {
garantirDonoOuAdmin(solicitante, idUsuario);
return this.prisma.address.findMany({
where: { idUsuario },
orderBy: { id: 'asc' },
});
}
// Aqui o dono só é conhecido depois de carregar o registro
async atualizar(id: number, dto: UpdateAddressDto, solicitante: UsuarioAutenticado) {
const endereco = await this.buscarOuFalhar(id);
garantirDonoOuAdmin(solicitante, endereco.idUsuario);
return this.prisma.address.update({ where: { id }, data: dto });
}

catch (erro) {
if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2003') {
throw new NotFoundException(`Usuario ${idUsuario} nao encontrado`);
}
throw erro;
}
export class AddressesController {}
