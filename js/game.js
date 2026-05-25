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
            vida: 10,
            velocidade: 2
        },

        {
            tipo: "rato_v2",
            vida: 15,
            velocidade: 2.5
        },

        {
            tipo: "besouro",
            vida: 20,
            velocidade: 1.5
        },

        {
            tipo: "robo_base",
            vida: 30,
            velocidade: 1
        },

        {
            tipo: "robo_v2",
            vida: 40,
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

        jogador.corre();

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
        // INIMIGOS
        // =========================

        for (const inimigo of inimigos) {

            inimigo.buscaJogador(
                jogador
            );
        }
    }

    init();

})();