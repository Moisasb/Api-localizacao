import { Injectable, BadGatewayException, NotFoundException, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class LocalizacaoService {
    constructor(private readonly httpService: HttpService) { }

    // CONSULTA O POR CEP  
    async buscarCep(cep: string) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            throw new BadRequestException('O cep deve possuir 8 números');
        }

        try {
            const resposta = await lastValueFrom(
                this.httpService.get(`https://viacep.com.br/ws/${cepLimpo}/json`)
            );

            // O conteúdo retornado pela API fica dentro da propriedade data
            const dados = resposta.data;

            // Quando o cep não existe a API retorna "erro": "true", então nós traduzimos isso para o usuário como 'Cep não encontrado'.
            if (dados.erro) {
                throw new NotFoundException('CEP não encontrado');
            }

            return {
                cep: dados.cep,
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                cidade: dados.localidade,
                estado: dados.uf,
                regiao: dados.regiao
            };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof AxiosError && error.response) {
                throw new BadGatewayException('Erro ao comunicar com o serviço de CEP');
            }
            // Caso a APi Viacep esteja fora do ar.
            throw new ServiceUnavailableException('Serviço de consulta de CEP indisponível no momento');
        }
    }

    // Função responsável por consultar a localização por cidade
    async buscarCidade(cidade: string) {
        if (!cidade || cidade.trim().length < 2) {
            throw new BadRequestException('Informe uma cidade válida');
        }

        try {
            // encodeURIComponent prepara o texto para ser enviado para a API (sendo utilizado dentro de uma URL). Dessa forma, conseguimos passar "São paulo" normalmente através da URL
            const cidadeCodificada = encodeURIComponent(cidade.trim());

            const resposta = await lastValueFrom(
                this.httpService.get('https://geocodind-api.open-meteo.com/v1/search', {
                    params: {
                        nome: cidadeCodificada,
                        count: 1,
                        languare: 'pt',
                        countryCode: 'BR'
                    }
                })
            );
            // Recebe os dados da resposta
            const dados = resposta.data;
            // A API vai retornar os dados dentro de um array chamado results: []. Se este não existir ou estiver vazio, informamos ao usuário
            if (!dados.results || dados.results.length === 0) {
                throw new NotFoundException('Localidade não encontrada');
            }
            // Pegamos o primeiro resultado trago
            const localizacao = dados.results[0];

            return {
                cidade: localizacao.name,
                estado: localizacao.admin1, // admin1 representa o estado/região dentro da API
                pais: localizacao.country,
                latitude: localizacao.latitude,
                longitude: localizacao.longitude,
            };
        } catch (erro) {
            if (
                erro instanceof NotFoundException ||
                erro instanceof BadRequestException
            ) {
                throw erro;
            }
            throw new ServiceUnavailableException(
                'Não foi possível consultar o serviço de localização',
            );
        }
    }
}