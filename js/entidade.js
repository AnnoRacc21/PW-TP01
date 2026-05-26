import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js"


export default class Entidade {

    constructor(
        arenaElement,
        colisao,
        classeCSS,
        velocidade,
        vida,
        angulo
    ) {

        this.arenaElement = arenaElement;

        this.element = document.createElement("div");

        this.element.className = classeCSS;

        this.element.style.position = "absolute";

        this.element.style.height =
            `${ALTURA_PERSONAGEM}px`;

        this.element.style.width =
            `${LARGURA_PERSONAGEM}px`;

        // hitbox menor
        this.altura  = ALTURA_PERSONAGEM * 0.45;
        this.largura = LARGURA_PERSONAGEM * 0.45;

        this.x = arenaElement.offsetWidth / 2;
        this.y = arenaElement.offsetHeight / 2;

        this.velocidade = velocidade;
        this.vida = vida;
        this.angulo = angulo

        this.colisao = colisao;

        
        // Debug Hitbox
 

        this.hitboxDebug =
            document.createElement("div");

        this.hitboxDebug.style.position =
            "absolute";

        this.hitboxDebug.style.border =
            "2px solid red";

        this.hitboxDebug.style.backgroundColor =
            "rgba(255,0,0,0.2)";

        this.hitboxDebug.style.pointerEvents =
            "none";

        this.hitboxDebug.style.zIndex =
            "1000";

        arenaElement.appendChild(this.hitboxDebug);

        // Fim do Debug

        arenaElement.appendChild(this.element);

        this.renderizar();
    }

    renderizar() {

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Aplica a rotação visual usando o ângulo guardado na Entidade
        if (this.angulo !== undefined && !isNaN(this.angulo)) {
            this.element.style.transform = `rotate(${this.angulo}deg)`;
        }

        // Centraliza hitbox no sprite
        const offX = (LARGURA_PERSONAGEM - this.largura) / 2;
        const offY = (ALTURA_PERSONAGEM - this.altura) / 2;

        // Hitbox
        // this.hitboxDebug.style.left = `${this.x + offX}px`;
        // this.hitboxDebug.style.top = `${this.y + offY}px`;
        // this.hitboxDebug.style.width = `${this.largura}px`;
        // this.hitboxDebug.style.height = `${this.altura}px`;
    }

    tentarMover(proximoX, proximoY) {
        const offX = (LARGURA_PERSONAGEM - this.largura) / 2;
        const offY = (ALTURA_PERSONAGEM - this.altura) / 2;

        const limiteMinX = -offX;
        const limiteMinY = -offY;

        const limiteMaxX = this.arenaElement.offsetWidth - LARGURA_PERSONAGEM + offX;
        const limiteMaxY = this.arenaElement.offsetHeight - ALTURA_PERSONAGEM + offY;

        proximoX = Math.max(limiteMinX, Math.min(proximoX, limiteMaxX));
        proximoY = Math.max(limiteMinY, Math.min(proximoY, limiteMaxY));

        let hitboxTesteX = { x: proximoX + offX, y: this.y + offY, largura: this.largura, altura: this.altura };
        let hitboxTesteY = { x: this.x + offX, y: proximoY + offY, largura: this.largura, altura: this.altura };

        if (!this.colisao.estaColidindo(hitboxTesteX)) {
            this.x = proximoX;
        }
        if (!this.colisao.estaColidindo(hitboxTesteY)) {
            this.y = proximoY;
        }
    }

    atualizarAngulo(dx, dy) { // Função para calcular o angulo que a imagem deve rotacionar 
        if (dx !== 0 || dy !== 0) {
            let anguloEmGraus = Math.atan2(dy, dx) * (180 / Math.PI);
            this.angulo = anguloEmGraus - 90;
        }
    }
}