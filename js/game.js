import Arena from './arena.js';
import Jogador from './jogador.js';
import Controles from './controles.js';
import Colisao from './colisao.js';
import { Inimigo } from './inimigo.js';

import {FPS, LARGURA_ARENA, ALTURA_ARENA, VOLUME_MUSICA} from './config.js';


(function () {

    let gameLoop;

    let arena;
    let jogador;
    let controles;
    let colisao;
    let projeteis_ativos = [];
    let inimigos = [];
    let pontuacao = 0
    const musicaFundo = new Audio('../assets/audio/musica_tema.mp3'); 
    // Configurações iniciais da música
    musicaFundo.loop = true;          
    musicaFundo.volume = VOLUME_MUSICA; 
    let musicaMutada = false;

    // =========================================
    // CONFIG SPAWN
    // =========================================

    const MAX_INIMIGOS = 5;

    let intervaloSpawn = 5000; // 5 segundos
    const INTERVALO_MINIMO = 1000;

    let ultimoSpawn = 0;

    // =========================================
    // TIPOS DE INIMIGOS
    // =========================================

    const tiposInimigos = [

        {
            tipo: "rato_base",
            vida: 3,
            velocidade: 2,
            dano: 0.5,
            pontuacao: 100
        },

        {
            tipo: "rato_v2",
            vida: 6,
            velocidade: 2.5,
            dano: 1,
            pontuacao: 200
        },

        {
            tipo: "besouro",
            vida: 10,
            velocidade: 2.5,
            dano: 2,
            pontuacao: 1000
        },

        {
            tipo: "robo_base",
            vida: 15,
            velocidade: 1,
            dano: 4,
            pontuacao: 1000
        },

        {
            tipo: "robo_v2",
            vida: 10,
            velocidade: 0.8,
            dano: 3,
            pontuacao: 800
        }
    ];

    // =========================================
    // SPAWN
    // =========================================

    function spawnarInimigo() {

        // limite máximo
        if (inimigos.length >= MAX_INIMIGOS) {
            return;
        }

        // sorteia tipo
        const config =
            tiposInimigos[
                Math.floor(
                    Math.random() * tiposInimigos.length
                )
            ];

        const inimigo = new Inimigo(
            arena.container,
            colisao,
            config.tipo,
            config.vida,
            config.velocidade,
            config.dano,
            config.pontuacao
        );

        inimigos.push(inimigo);

        // diminui lentamente o intervalo
        if (intervaloSpawn > INTERVALO_MINIMO) {

            intervaloSpawn -= 150;
        }
    }

    // =========================================
    // FUNÇÕES AUXILIARES DO HUD
    // =========================================

    function atualizarHudPontos() {
        const elementoPontos = document.getElementById("texto-pontos");
        if (elementoPontos) {
            elementoPontos.innerText = String(pontuacao).padStart(5, '0');
        }
    }

    // =========================================
    // LOOP PRINCIPAL
    // =========================================

    function run() {

        jogador.corre(); // Pra correr
        jogador.atirar(projeteis_ativos); // Pra poder atirar

        // =========================
        // SPAWN TEMPORIZADO
        // =========================

        const agora = performance.now();

        if (
            agora - ultimoSpawn >= intervaloSpawn
        ) {

            spawnarInimigo();

            ultimoSpawn = agora;
        }
         
        // =========================
        // PROJETEIS
        // =========================

        for (let i = projeteis_ativos.length - 1; i >= 0; i--) {
            const projetil = projeteis_ativos[i];
            
            // Move o tiro e checa colisões contra a nossa lista de inimigos atual
            projetil.atualizar(inimigos);

            // Se o tiro colidiu ou saiu da arena, remove ele do array de rastreamento
            if (!projetil.ativo) {
                projeteis_ativos.splice(i, 1);
            }
        }

        // =========================
        // INIMIGOS
        // =========================

        for (let i = inimigos.length - 1; i >= 0; i--) {
            const inimigo = inimigos[i];

            // Se o inimigo morreu pelos projéteis, distribui os pontos e o remove
            if (inimigo.vida <= 0) {
                
                // Distribuição de Score dinâmico baseado no monstro
                let pontosGanhos = 100;
                pontosGanhos = inimigo.pontuacao

                pontuacao += pontosGanhos;
                atualizarHudPontos(); // Atualiza o placar na hora

                if (inimigo.element) inimigo.element.remove();
                if (inimigo.hitboxDebug) inimigo.hitboxDebug.remove();
                inimigos.splice(i, 1);
                continue;
            }

            // Criamos as caixas virtuais de colisão baseadas na posição X e Y atuais de cada um
            let hitboxJogador = {
                x: jogador.x,
                y: jogador.y,
                largura: jogador.largura,
                altura: jogador.altura
            };

            let hitboxInimigo = {
                x: inimigo.x,
                y: inimigo.y,
                largura: inimigo.largura,
                altura: inimigo.altura
            };

            // Verifica se a hitbox do inimigo encostou na do jogador
            if (colisao._testarSobreposicao(hitboxJogador, hitboxInimigo)) {
                jogador.receberDano(inimigo.dano); 
            }

            // Se não encostou e continua vivo, segue caçando o jogador
            inimigo.buscaJogador(jogador);
        }
    }

    // =========================================
    // RESPONSIVIDADE
    // =========================================

    function ajustarTela() {
        const cenario = document.getElementById("cenario-jogo");
        if (!cenario) return;

        const larguraOriginal = LARGURA_ARENA; 
        const alturaOriginal = ALTURA_ARENA;

        // Pega o tamanho real e atual da janela do navegador
        const larguraJanela = window.innerWidth;
        const alturaJanela = window.innerHeight;

        // Descobre a escala necessária para a largura e para a altura separadamente
        const escalaX = larguraJanela / larguraOriginal;
        const escalaY = alturaJanela / alturaOriginal;
        
        cenario.style.transform = `scale(${escalaX}, ${escalaY})`;
    }

     // =========================================
    // MÚSICA
    // =========================================

    function gerenciarMusica() {
        const botao = document.getElementById("botao-musica");
        if (!botao) return;

        botao.addEventListener("click", () => {
            // Se a música estava pausada (primeiro clique do jogo), começa a tocar
            if (musicaFundo.paused && !musicaMutada) {
                musicaFundo.play().catch();
                botao.src = "../assets/images/musica_on.png"
                return;
            }

            // Lógica de Mute / Unmute
            if (musicaMutada) {
                musicaFundo.muted = false;
                botao.src = "../assets/images/musica_on.png"
                musicaMutada = false;
            } else {
                musicaFundo.muted = true;
                botao.src = "../assets/images/musica_off.png"
                musicaMutada = true;
            }
        });
    }

    // =========================================
    // INIT
    // =========================================

    function init() {
        controles = new Controles();
        arena = new Arena(ALTURA_ARENA, LARGURA_ARENA);
        colisao = new Colisao(arena.container);
        jogador = new Jogador(arena.container, controles, colisao);
        atualizarHudPontos(); // Inicializa o HUD com 00000 no começo da partida
        gerenciarMusica(); // Ativa o ouvinte de clique do botão
        ajustarTela();
        window.addEventListener("resize", ajustarTela); 
        gameLoop = setInterval(run,1000 / FPS);
    }

    init();

})();