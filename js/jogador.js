import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js"

export default class Jogador {
    constructor(arenaElement, controles, colisao) { // Seta onde o personagem vai aparecer
        this.element = document.createElement("div");
        this.element.className = "jogador";
        
        this.element.style.height = `${ALTURA_PERSONAGEM}px` // Altura do personagem
        this.element.style.width = `${LARGURA_PERSONAGEM}px` // Largura do personagem
        this.altura = ALTURA_PERSONAGEM/2;   
        this.largura = LARGURA_PERSONAGEM/2; 
        

        this.vida = 3;
        this.x = 400;
        this.y = 320;
        this.velocidade = 3; 

        this.movimentacaoX = 0; 
        this.movimentacaoY = 0; 

        this.colisao = colisao
        this.controles = controles; 

        arenaElement.appendChild(this.element);
        this.renderizar();
    }

    calcularAngulo() { //
        // Math.atan2 retorna o ângulo em radianos com base nos eixos X e Y. Convertemos para graus multiplicando por (180 / Math.PI)
        let anguloEmGraus = Math.atan2(this.movimentacaoY, this.movimentacaoX) * (180 / Math.PI);
        this.angulo = anguloEmGraus - 90; 
    }

    renderizar() { // Desenha o personagem na posição x e y da classe, tambem rotacionando a imagem caso necessario
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        
        if (this.angulo !== undefined) { // Aplica a rotação visual no elemento CSS
            this.element.style.transform = `rotate(${this.angulo}deg)`;
        }
    }

    corre() { // Função que move o personagem 
        const keyW = this.controles.estaPressionada("KeyW");
        const keyS = this.controles.estaPressionada("KeyS");
        const keyA = this.controles.estaPressionada("KeyA");
        const keyD = this.controles.estaPressionada("KeyD");

        this.movimentacaoY = keyS - keyW; // 1 = Baixo, -1 = Cima, 0 = Parado
        this.movimentacaoX = keyD - keyA; // 1 = Direita, -1 = Esquerda, 0 = Parado
        
        let proximoX = this.x + this.movimentacaoX * this.velocidade;
        let proximoY = this.y + this.movimentacaoY * this.velocidade;

        // Hitboxes
        let hitboxTesteX = { x: proximoX, y: this.y, largura: this.largura, altura: this.altura };
        let hitboxTesteY = { x: this.x, y: proximoY, largura: this.largura, altura: this.altura };

        // Antes do personagem andar, é perguntado se vai colidir com algo ou não
        if (!this.colisao.estaColidindo(hitboxTesteX)) {
            this.x = proximoX;
        }
        if (!this.colisao.estaColidindo(hitboxTesteY)) {
            this.y = proximoY;
        }
        
        if (this.movimentacaoX !== 0 || this.movimentacaoY !== 0) { // Atualiza o ângulo apenas se o robô estiver se movendo
            this.calcularAngulo(); // Calcula o angulo dele e aplica
        }
        
        this.renderizar();
    }

}