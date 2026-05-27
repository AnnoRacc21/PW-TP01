import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM, TEMPO_ESPERA_DISPARO, VOLUME_JOGO } from "./config.js"
import Entidade from "./entidade.js"
import Projetil from "./projetil.js";

const somDisparo = new Audio("../assets/audio/disparo_arma.mp3");
        somDisparo.volume = 0.3
         * VOLUME_JOGO; // Ajusta o volume

export default class Jogador extends Entidade {
        constructor(arenaElement, controles, colisao) {
        super(arenaElement, colisao, "jogador", 3, 3);
        this.controles = controles;
        // Configurações de cadência de tiro
        this.ultimoDisparo = 0;
        this.tempoRecarga = TEMPO_ESPERA_DISPARO; // Tempo em milissegundos entre um tiro e outro
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

    atirar(listaDeProjeteisGlobal) {
        const agora = Date.now();

        if (agora - this.ultimoDisparo < this.tempoRecarga) return;

        // Detecta quais setas de direção estão pressionadas
        const atirarCima  = this.controles.estaPressionada("ArrowUp");
        const atirarBaixo = this.controles.estaPressionada("ArrowDown");
        const atirarEsqu  = this.controles.estaPressionada("ArrowLeft");
        const atirarDire  = this.controles.estaPressionada("ArrowRight");

        // Calcula o vetor de direção do disparo
        let dirY = atirarBaixo - atirarCima;
        let dirX = atirarDire - atirarEsqu;

        // Só cria o projétil se pelo menos uma seta estiver pressionada
        if (dirX !== 0 || dirY !== 0) {
            
            // Correção matemática para diagonais (evita que o tiro viaje mais rápido em diagonal)
            if (dirX !== 0 && dirY !== 0) {
                dirX *= 0.7071;
                dirY *= 0.7071;
            }

            // Cria o novo projétil e o coloca na lista global do loop principal
            somDisparo.currentTime = 0
            somDisparo.play(); // Coloca o som de disparo
            const novoTiro = new Projetil(this.arenaElement, this.colisao, this.x, this.y, dirX, dirY);
            listaDeProjeteisGlobal.push(novoTiro);

            this.ultimoDisparo = agora; // Reinicia o relógio do cooldown
        }
    }
}