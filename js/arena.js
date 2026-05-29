export default class Arena { 
    constructor(altura, largura) {
        // Criação do container principal
        this.container = document.createElement("div");
        this.container.className = "arena-container";
        this.container.style.position = "relative";
        this.container.style.width = `${largura}px`;
        this.container.style.height = `${altura}px`;

        // Criação do Chão
        this.chao = document.createElement("div");
        this.chao.className = "chao";
        this.chao.style.position = "absolute";
        this.chao.style.top = "0";
        this.chao.style.left = "0";
        this.chao.style.height = "100%";
        this.chao.style.width = "100%";
        this.chao.style.backgroundImage = "url(../assets/images/arena_chao.png)";

        // Criação da Parede
        this.parede = document.createElement("div");
        this.parede.className = "parede";
        this.parede.style.position = "absolute";
        this.parede.style.top = "0";
        this.parede.style.left = "0";
        this.parede.style.height = "100%";
        this.parede.style.width = "100%";
        this.parede.style.pointerEvents = "none"; 
        this.parede.style.backgroundImage = "url(../assets/images/arena_paredes.png)";

        // Adiciona o chão e depois a parede
        this.container.appendChild(this.chao);
        this.container.appendChild(this.parede);

        document.getElementById("cenario-jogo").appendChild(this.container);
    }        
}