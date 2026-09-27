import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    erro: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const resposta = host.switchToHttp().getResponse<Response>();

    const { status, mensagem } = this.traduzir(erro);

    this.logger.warn(
      `Prisma ${erro.code}: ${erro.message.split('\n').pop()}`,
    );

    resposta.status(status).json({
      statusCode: status,
      message: mensagem,
      error: erro.code,
    });
  }

  private traduzir(erro: Prisma.PrismaClientKnownRequestError): {
    status: number;
    mensagem: string;
  } {
    switch (erro.code) {
      case 'P2002':
        return {
          status: 409,
          mensagem: 'Já existe um registro com esse valor.',
        };

      case 'P2003':
        return {
          status: 400,
          mensagem: 'Não foi possível realizar a operação devido a uma referência inválida.',
        };

      case 'P2025':
        return {
          status: 404,
          mensagem: 'Registro não encontrado.',
        };

      default:
        return {
          status: 500,
          mensagem: 'Ocorreu um erro interno no servidor.',
        };
    }
  }
}


