import Entidade from "./entidade.js";
import {ALTURA_PERSONAGEM, LARGURA_PERSONAGEM} from "./config.js"

export class PowerUp extends Entidade {
    constructor(arenaElement, colisao, tipo, efeito) {

        super(
            arenaElement,
            colisao,
            tipo,
            0,
            0,
            0,
        );

        this.efeito = efeito
        this.spawnar(arenaElement)
        this.renderizar()
    }

    spawnar(arenaElement) {
        const larguraArena = arenaElement.offsetWidth;
        const alturaArena  = arenaElement.offsetHeight;

        this.x = Math.random() * (larguraArena - LARGURA_PERSONAGEM);
        this.y = Math.random() * (alturaArena - ALTURA_PERSONAGEM);
    }
}
