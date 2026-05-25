import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js"


export default class Entidade {

    constructor(
        arenaElement,
        colisao,
        classeCSS,
        velocidade,
        vida
    ) {

        this.element = document.createElement("div");

        this.element.className = classeCSS;

        this.element.style.position = "absolute";

        this.element.style.height =
            `${ALTURA_PERSONAGEM}px`;

        this.element.style.width =
            `${LARGURA_PERSONAGEM}px`;

        // hitbox menor
        this.altura  = ALTURA_PERSONAGEM * 0.6;
        this.largura = LARGURA_PERSONAGEM * 0.6;

        this.x = arenaElement.offsetWidth / 2;
        this.y = arenaElement.offsetHeight / 2;

        this.velocidade = velocidade;
        this.vida = vida;

        this.colisao = colisao;

        // =========================
        // DEBUG HITBOX
        // =========================

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

        // =========================

        arenaElement.appendChild(this.element);

        this.renderizar();
    }

    renderizar() {

        // sprite
        this.element.style.left =
            `${this.x}px`;

        this.element.style.top =
            `${this.y}px`;

        // centraliza hitbox no sprite
        const offX =
            (LARGURA_PERSONAGEM - this.largura) / 2;

        const offY =
            (ALTURA_PERSONAGEM - this.altura) / 2;

        // hitbox
        this.hitboxDebug.style.left =
            `${this.x + offX}px`;

        this.hitboxDebug.style.top =
            `${this.y + offY}px`;

        this.hitboxDebug.style.width =
            `${this.largura}px`;

        this.hitboxDebug.style.height =
            `${this.altura}px`;
    }
}