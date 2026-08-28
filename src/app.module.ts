import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocalizaçaoModule } from './localizacao/localizaçao.module';
import { LocalizacaoController } from './localizacao/localizacao.controller';
import { LocalizacaoService } from './localizacao/localizacao.service';


@Module({
  imports: [LocalizaçaoModule, HttpModule],
  controllers: [LocalizacaoController],
  providers: [LocalizacaoService],
})
export class AppModule {}
