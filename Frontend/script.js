// Configuração inicial do mapa

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
            throw new Error(dados.message || 'Não foi possível realizar a consulta');
        }

        // Mostrará os dados na tela
        preencherInformacoes(dados);
        
        // Atualizar nosso mapa 
        atualizarMapa(
            dados.latitude,
            dados.longitude,
            `${dados.logradouro} - ${dados.cidade}`
        );
    } catch (erro) {
        mensagem.textContent = erro.message;
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
    document.getElementById('longitude').textContent = dados.longitude || '-';
}

// Função responsável por atualizar nosso mapa com as novas coordenadas
function atualizarMapa(latitude, longitude, textoMarcador) {
    // Centraliza o mapa na localização informada com zoom 15
    mapa.setView([latitude, longitude], 15);
    
    // Se já existir um marcador, removemos antes de criar um novo
    if (marcador) {
        mapa.removeLayer(marcador);
    }
    
    // Cria o novo marcador no mapa
    marcador = L.marker([latitude, longitude])
        .addTo(mapa)
        .bindPopup(textoMarcador)
        .openPopup();
}

// LOCALIZAÇÃO ATUAL
btnLocalizacao.addEventListener('click', () => {
    mensagem.textContent = '';
    
    // Verificamos se o navegador possui suporte a geolocalização
    if (!navigator.geolocation) {
        mensagem.textContent = 'Seu navegador não possui suporte de geolocalização';
        return;
    }
    
    // Caso tenha suporte, podemos prosseguir
    navigator.geolocation.getCurrentPosition(
        (posicao) => {
            // Pegamos as informações através do navegador
            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;
            
            // Mostramos as coordenadas na tela
            document.getElementById('latitude').textContent = latitude;
            document.getElementById('longitude').textContent = longitude;
            
            // A partir daqui, como não precisamos do CEP, limpamos os campos do endereço
            document.getElementById('resultadoCep').textContent = '-';
            document.getElementById('logradouro').textContent = '-';
            document.getElementById('bairro').textContent = '';
            document.getElementById('cidade').textContent = '';
            document.getElementById('estado').textContent = '';
            
            // Atualizamos o mapa
            atualizarMapa(latitude, longitude, 'Minha Localização');
        }, 
        // Caso haja algum erro 
        (erro) => {
            if (erro.code === 1) {
                mensagem.textContent = 'Permissão de localização negada';
            } else {
                mensagem.textContent = 'Não foi possível obter sua localização';
            }
        }
    );
});