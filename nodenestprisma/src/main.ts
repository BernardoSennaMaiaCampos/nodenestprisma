import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



app.use(helmet());
@Public()
@UseGuards(ThrottlerGuard)
@Throttle({ login: { limit: 5, ttl: 60_000 } })
@Post('login')
async function bootstrap(): Promise<void> {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(
new ValidationPipe({
whitelist: true,
forbidNonWhitelisted: true,
transform: true,
}),
);
const config = app.get(ConfigService);
const porta = config.get<number>('PORT', 3000);
await app.listen(porta);
Logger.log(`API no ar em http://localhost:${porta}`, 'Bootstrap');
}
void bootstrap();
const config = new DocumentBuilder()
.setTitle('NodeNestPrisma API')
.setDescription('CRUD de usuarios, enderecos e contatos com JWT e RBAC.')
.setVersion('1.0')
.addBearerAuth()
.build();
const documento = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, documento, {
swaggerOptions: { persistAuthorization: true },
});