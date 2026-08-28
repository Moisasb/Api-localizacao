// Configuração inicial do mapa

const { error } = require("console");

// Definimos aqui um lugar para a posição inicial do mapa (neste caso, no brasil)
const mapa = L.map('mapa').setView([-14.235, -51.9253], 4);

// Responsável por adicionar as imagens do mapa utilizando OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap Contributors'
}).addTo(mapa);

// Este será nosso marcador atual, ele quem vai permitir que a gente remova o marcador antigo.
let marcador;

// Elementos do HTML
const inputCep = document.getElementById('cep');
const btnBuscar = document.getElementById('btnBuscar');
const btnLocalizacao = document.getElementById('btnLocalizacao');
const mensagem = document.getElementById('mensagem');

// Evento que será disparado ao clicar no botão "Buscar"
// Iremos disparar a função assíncrona onde o valor do Input será trazido para dentro da função sem os espaços vazios
btnBuscar.addEventListener('click', async () => {
    const cep = inputCep.value.trim();
    mensagem.textContent = '';
    // Se não houver um cep digitado no input
    if (!cep) {
        mensagem.textContent = 'Informe o CEP';
        return;
    }
    try {
        // O nosso frontend não consulta diretamente o ViaCEP, ele consulta a nossa API
        const resposta = await fetch(`http://localhost:3000/localizacao/cep/${cep}`);

        // Convertemos a resposta para JSON
        const dados = await resposta.json();

        // Se a API retornar erro HTTP, por exemplo 400 ou 404
        if (!resposta.ok) {
            throw new error(dados.message) || 'Não foi possível realzar a consulta'
        }

        // Mostrará os dados na tela
        preencherInformacoes(dados);
        //  Atualizar nosso mapa 
        atualizarMapa(
            dados.latitude,
            dados.longitude,
            `${dados.longradouro} - ${dados.cidade} `
        )
    } catch (erro) {
        mensagem.textContent = erro, message
    }
});
// Função responsável por preencher as informações sobre o cep, na tela do usuário
function preencherInformacoes(dados) {
    document.getElementById('resultadoCep').textContent = dados.cep || '-';
    document.getElementById('logradouro').textContent = dados.logradouro || '-';
    document.getElementById('bairro').textContent = dados.bairro || '-';
    document.getElementById('cidade').textContent = dados.cidade || '-';
    document.getElementById('estado').textContent = dados.estado || '-';
    document.getElementById('latitude').textContent = dados.latitude || '-';
    document.getElementById('longidute').textContent = dados.longidute || '-';
}

//  Função responsável por atualizar nosso mapa com as novas coordenadas
function atualizarMapa(latitude, longidute, textoMarcador) {
    // Centraliza o mapa na localização informada
    mapa.setView([latitude, longidute, 15])
    // Se já existir um marcador, removemos antes de criar um novo
    if (marcador) {
        mapa.removeLayer(marcador);
    }
    //  Cria o novo marcador (vermelho, no mapa)
    marcador = L.marker([latitude, longidute]
        .addto(mapa)
        .bindPopup(textoMarcador)
        .openPopup()
    )
}