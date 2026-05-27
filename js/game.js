import Arena from './arena.js';
import Jogador from './jogador.js';
import Controles from './controles.js';
import Colisao from './colisao.js';
import { Inimigo } from './inimigo.js';

import {FPS, WIDTH, HEIGHT } from './config.js';


(function () {

    let gameLoop;

    let arena;
    let jogador;
    let controles;
    let colisao;
    let projeteis_ativos = [];
    let inimigos = [];
    let pontuacao = 0

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
            velocidade: 0.8,
            dano: 2,
            pontuacao: 750
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
    // INIT
    // =========================================

    function init() {

        controles = new Controles();

        arena = new Arena(
            HEIGHT,
            WIDTH
        );

        colisao = new Colisao(
            arena.container
        );

        jogador = new Jogador(
            arena.container,
            controles,
            colisao
        );

        // Inicializa o HUD com 00000 no começo da partida
        atualizarHudPontos();

        gameLoop = setInterval(
            run,
            1000 / FPS
        );
    }

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
    init();

})();