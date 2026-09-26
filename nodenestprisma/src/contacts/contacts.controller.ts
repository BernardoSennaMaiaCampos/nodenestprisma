import { Controller } from '@nestjs/common';

@Controller('contacts')
/ O parâmetro já é o dono
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


export class ContactsController {}
