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
            velocidade: 2
        },

        {
            tipo: "rato_v2",
            vida: 6,
            velocidade: 2.5
        },

        {
            tipo: "besouro",
            vida: 10,
            velocidade: 0.8
        },

        {
            tipo: "robo_base",
            vida: 15,
            velocidade: 1
        },

        {
            tipo: "robo_v2",
            vida: 10,
            velocidade: 0.8
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
            config.velocidade
        );

        inimigos.push(inimigo);

        // diminui lentamente o intervalo
        if (intervaloSpawn > INTERVALO_MINIMO) {

            intervaloSpawn -= 150;
        }
    }

    // =========================================
    // LOOP
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

            // Checa se o inimigo morreu. Se a vida do inimigo zerou devido aos tiros
            if (inimigo.vida <= 0) {
                // Remove o elemento visual e as hitboxes de debug do inimigo da tela
                if (inimigo.element) 
                    inimigo.element.remove();
                if (inimigo.hitboxDebug) 
                    inimigo.hitboxDebug.remove();
                
                // Remove o objeto da lista
                inimigos.splice(i, 1);
                continue;
            }

            // Se continuar vivo, segue buscando o jogador com o A*
            inimigo.buscaJogador(jogador);
        }
    }

    init();

})();