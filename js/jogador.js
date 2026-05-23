export default class Jogador {
    constructor(arenaElement, controles) {
        this.element = document.createElement("div");
        this.element.className = "jogador";
        
        this.vida = 3;
        this.x = 482;
        this.y = 330;
        this.velocidade = 3; 

        this.movimentacaoX = 0; 
        this.movimentacaoY = 0; 

        this.controles = controles; 

        arenaElement.appendChild(this.element);
        this.renderizar();
    }

    corre() {
        const keyW = this.controles.estaPressionada("KeyW");
        const keyS = this.controles.estaPressionada("KeyS");
        const keyA = this.controles.estaPressionada("KeyA");
        const keyD = this.controles.estaPressionada("KeyD");

        this.movimentacaoY = keyS - keyW;
        this.movimentacaoX = keyD - keyA;
        
        this.y += this.movimentacaoY * this.velocidade;
        this.x += this.movimentacaoX * this.velocidade;
        
        this.renderizar();
    }

    renderizar() {
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
    }
}