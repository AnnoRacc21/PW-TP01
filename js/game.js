import Arena from './arena.js'
import Jogador from './jogador.js'
import Controles from './controles.js';
import { FPS, WIDTH, HEIGHT } from './config.js'
import Colisao from './colisao.js';

(function () {
    let gameLoop;
    let arena;
    let jogador;
    let controles;
    let colisao;

    function init() {
        const root = document.getElementById('cenario-jogo'); 

        controles = new Controles();        
        arena = new Arena(HEIGHT, WIDTH);
        colisao = new Colisao(arena.container)
        jogador = new Jogador(arena.container, controles, colisao);

        gameLoop = setInterval(run, 1000 / FPS);
    }

    function run() {
        jogador.corre();
    }

    init();

})();