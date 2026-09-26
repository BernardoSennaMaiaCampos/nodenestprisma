import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
private readonly logger = new Logger(PrismaExceptionFilter.name);
catch(erro: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
const resposta = host.switchToHttp().getResponse<Response>();
const { status, mensagem } = this.traduzir(erro);
this.logger.warn(`Prisma ${erro.code}: ${erro.message.split('\n').pop()}`);
resposta.status(status).json({ statusCode: status, message: mensagem, error: erro.code
});
}
// traduzir(): P2002 -> 409, P2003 -> 400, P2025 -> 404, resto -> 500
}
