import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js"

export default class Jogador {
    constructor(arenaElement, controles, colisao) {
        this.element = document.createElement("div");
        this.element.className = "jogador";
        this.element.style.height = `${ALTURA_PERSONAGEM}px`;
        this.element.style.width  = `${LARGURA_PERSONAGEM}px`;

        // hitbox menor que o sprite (60%), centralizada
        this.altura  = ALTURA_PERSONAGEM  * 0.6;
        this.largura = LARGURA_PERSONAGEM * 0.6;

        this.vida = 3;
        this.x = (arenaElement.offsetWidth  / 2) - (LARGURA_PERSONAGEM / 2);
        this.y = (arenaElement.offsetHeight / 2) - (ALTURA_PERSONAGEM  / 2);
        this.velocidade = 3;
        this.movimentacaoX = 0;
        this.movimentacaoY = 0;
        this.colisao  = colisao;
        this.controles = controles;
        arenaElement.appendChild(this.element);
        this.renderizar();
    }

    calcularAngulo() {
        let anguloEmGraus = Math.atan2(this.movimentacaoY, this.movimentacaoX) * (180 / Math.PI);
        this.angulo = anguloEmGraus - 90;
    }

    renderizar() {
        this.element.style.top  = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        if (this.angulo !== undefined) {
            this.element.style.transform = `rotate(${this.angulo}deg)`;
        }
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