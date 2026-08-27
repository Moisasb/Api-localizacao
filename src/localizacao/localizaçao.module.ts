import { Module } from '@nestjs/common';
import { LocalizacaoController } from './localizacao.controller';
import { LocalizacaoService } from './localizacao.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports:[HttpModule],
    controllers: [LocalizacaoController],
    providers: [LocalizacaoService]
})
export class LocalizaçaoModule {}
