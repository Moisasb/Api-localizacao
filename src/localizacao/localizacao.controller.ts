import { Controller, Get, Param } from '@nestjs/common';
import { LocalizacaoService } from './localizacao.service';

@Controller('localizacao')
export class LocalizacaoController {
    constructor(private readonly localizacaoService: LocalizacaoService) { }

    // GET para localizacao/cep/:cep
    @Get('cep/:cep')
    buscarCep(@Param('cep') cep: string) {
        return this.localizacaoService.buscarCep(cep);
    }

    // GET para localizacao/cidade/:cidade
    @Get('cidade/:cidade')
    buscarCidade(@Param('cidade') cidade: string) {
        return this.localizacaoService.buscarCidade(cidade);
    }

    // GET para localizacao/cep/:cep/coordenadas
    @Get('cep/:cep/coordenadas')
    buscarCepComCoordenadas(@Param('cep') cep: string) {
        return this.localizacaoService.buscarCepComCoordenadas(cep);
    }
}
