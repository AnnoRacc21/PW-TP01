import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM, TEMPO_ESPERA_DISPARO, VOLUME_JOGO, TEMPO_INVULNERAVEL} from "./config.js"
import Entidade from "./entidade.js"
import Projetil from "./projetil.js";

const somDisparo = new Audio("../assets/audio/disparo_arma.mp3");
const somDanoRobo = new Audio("../assets/audio/dano_robo.mp3");
somDisparo.volume = 0.3 * VOLUME_JOGO; // Ajusta o volume
somDanoRobo.volume = 0.3 * VOLUME_JOGO // Ajusta o volume

export default class Jogador extends Entidade {
        constructor(arenaElement, controles, colisao) {
        super(arenaElement, colisao, "jogador", 3, 10);
        this.controles = controles;
        // Configurações de cadência de tiro
        this.ultimoDisparo = 0;
        this.ultimoDanoRecebido = 0;
        
        this.vidaMax = 10;
        this.vida = 10;
        this.tempoInvulneravel = TEMPO_INVULNERAVEL;
        this.tempoRecarga = TEMPO_ESPERA_DISPARO; // Tempo em milissegundos entre um tiro e outro
        this.atualizarInterfaceVida();
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
            somDisparo.currentTime = 0;
            somDisparo.play(); // Coloca o som de disparo
            const novoTiro = new Projetil(this.arenaElement, this.colisao, this.x, this.y, dirX, dirY);
            listaDeProjeteisGlobal.push(novoTiro);

            this.ultimoDisparo = agora; // Reinicia o relógio do cooldown
        }
    }

    receberDano(quantidade) {
        const agora = Date.now();
        // Se ainda estiver no tempo de proteção (invulnerável), ignora o dano
        if (agora - this.ultimoDanoRecebido < this.tempoInvulneravel) return;

        this.vida -= quantidade;
        this.ultimoDanoRecebido = agora;

        // Atualiza a barra visual e o texto do HTML
        this.atualizarInterfaceVida();
        
        // Faz barulho de dano (metal)
        somDanoRobo.currentTime = 0;
        somDanoRobo.play(); // Coloca o som de metal

        // Faz o robô piscar (ficar transparente) enquanto estiver invulnerável
        if (this.element) {
            this.element.style.opacity = "0.5";
            setTimeout(() => {
                if (this.element) this.element.style.opacity = "1";
            }, this.tempoInvulneravel);
        }

        // Se a vida acabar, o jogador morre
        if (this.vida <= 0) {
            this.morrer();
        }
    }

    receberCura(quantidade) {
        this.vida = Math.min(this.vida + quantidade, 10);
        this.atualizarInterfaceVida();
    }

    atualizarInterfaceVida() {
        // Atualiza o número escrito no HUD 
        const elementoTextoVida = document.getElementById("texto-vida");
        if (elementoTextoVida) {
            elementoTextoVida.innerText = Math.max(0, this.vida); 
        }

        // Atualiza o preenchimento da barra
        const elementoBarraPlay = document.getElementById("barra-vida-preenchimento");
        if (elementoBarraPlay) {
            let porcentagem = (this.vida / this.vidaMax) * 100;
            porcentagem = Math.max(0, porcentagem); // Não deixa ficar menor que 0%
            
            elementoBarraPlay.style.width = `${porcentagem}%`;

            // Muda a cor da barra baseado na quantidade de vida
            if (porcentagem < 30) {
                elementoBarraPlay.style.backgroundColor = "#ff3333"; // Vermelho (Crítico)
            } else if (porcentagem < 60) {
                elementoBarraPlay.style.backgroundColor = "#ffcc00"; // Amarelo (Alerta)
            } else {
                elementoBarraPlay.style.backgroundColor = "#00ff66"; // Verde (Saudável)
            }
        }
    }

    morrer() {
        alert("Game Over! O robô foi destruído.");
        window.location.reload(); // Recarrega a página para reiniciar o jogo
    }
}