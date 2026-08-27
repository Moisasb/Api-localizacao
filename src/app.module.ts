import { Module } from '@nestjs/common';
import { LocalizaçaoModule } from './localizacao/localizaçao.module';
import { LocalizacaoController } from './localizacao/localizacao.controller';
import { LocalizacaoService } from './localizacao/localizacao.service';


@Module({
  imports: [LocalizaçaoModule],
  controllers: [LocalizacaoController],
  providers: [LocalizacaoService],
})
export class AppModule {}
