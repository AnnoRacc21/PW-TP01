import Arena from './arena.js'
import Jogador from './jogador.js'
import Controles from './controles.js';
import { FPS, WIDTH, HEIGHT } from './config.js'

(function () {
    let gameLoop;
    let arena;
    let jogador;
    let controles;

    function init() {
        const root = document.getElementById('cenario-jogo'); 

        controles = new Controles();        
        arena = new Arena(HEIGHT, WIDTH);
        jogador = new Jogador(arena.element, controles);

        gameLoop = setInterval(run, 1000 / FPS);
    }

    function run() {
        jogador.corre();
    }

    init();

})();