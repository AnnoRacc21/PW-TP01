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

    calcularAngulo() {
        let anguloEmGraus = Math.atan2(this.movimentacaoY, this.movimentacaoX) * (180 / Math.PI);
        this.angulo = anguloEmGraus - 90;
    }

    corre() {
        const keyW = this.controles.estaPressionada("KeyW");
        const keyS = this.controles.estaPressionada("KeyS");
        const keyA = this.controles.estaPressionada("KeyA");
        const keyD = this.controles.estaPressionada("KeyD");

        this.movimentacaoY = keyS - keyW;
        this.movimentacaoX = keyD - keyA;

        let proximoX = this.x + this.movimentacaoX * this.velocidade;
        let proximoY = this.y + this.movimentacaoY * this.velocidade;

        // offset para centralizar a hitbox no sprite
        const offX = (LARGURA_PERSONAGEM - this.largura) / 2;
        const offY = (ALTURA_PERSONAGEM  - this.altura)  / 2;

        let hitboxTesteX = { x: proximoX + offX, y: this.y    + offY, largura: this.largura, altura: this.altura };
        let hitboxTesteY = { x: this.x   + offX, y: proximoY  + offY, largura: this.largura, altura: this.altura };

        if (!this.colisao.estaColidindo(hitboxTesteX)) this.x = proximoX;
        if (!this.colisao.estaColidindo(hitboxTesteY)) this.y = proximoY;

        if (this.movimentacaoX !== 0 || this.movimentacaoY !== 0) {
            this.calcularAngulo();
        }

        this.renderizar();
    }
}