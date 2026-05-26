import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js"
import Entidade from "./entidade.js"


export default class Jogador extends Entidade {
        constructor(arenaElement, controles, colisao) {
        super(
            arenaElement,
            colisao,
            "jogador",
            3,
            3
        );

        this.controles = controles;
    }


    // renderizar() { 
    //     this.element.style.top = `${this.y}px`;
    //     this.element.style.left = `${this.x}px`;
        
    //     if (this.angulo !== undefined) { 
    //         this.element.style.transform = `rotate(${this.angulo}deg)`;
    //     }
    // }

    corre() {
        const keyW = this.controles.estaPressionada("KeyW");
        const keyS = this.controles.estaPressionada("KeyS");
        const keyA = this.controles.estaPressionada("KeyA");
        const keyD = this.controles.estaPressionada("KeyD");

        this.movimentacaoY = keyS - keyW;
        this.movimentacaoX = keyD - keyA;

        // Calcula a intenção de movimento do jogador
        let proximoX = this.x + this.movimentacaoX * this.velocidade;
        let proximoY = this.y + this.movimentacaoY * this.velocidade;

        this.tentarMover(proximoX, proximoY);

        if (this.movimentacaoX !== 0 || this.movimentacaoY !== 0) {
            this.atualizarAngulo(this.movimentacaoX, this.movimentacaoY);
        }

        this.renderizar();
    }
}