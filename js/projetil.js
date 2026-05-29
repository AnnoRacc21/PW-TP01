import Entidade from "./entidade.js";
import { ALTURA_PERSONAGEM, LARGURA_PERSONAGEM } from "./config.js";

export default class Projetil extends Entidade {
    constructor(arenaElement, colisao, xOrigem, yOrigem, dirX, dirY) {
        super(arenaElement, colisao, "projetil", 7, 1, 0); // Inicializa a Entidade pai (largura e altura menores para o tiro)

        // Reposiciona o tiro para nascer no centro do robô
        this.x = xOrigem + (LARGURA_PERSONAGEM / 2) - (this.largura);
        this.y = yOrigem + (ALTURA_PERSONAGEM / 2) - (this.altura);

        // Guarda a direção normalizada para onde o tiro vai se mover
        this.dirX = dirX;
        this.dirY = dirY;

        // Atribui uma rotação visual para o sprite do tiro apontar pro lugar certo
        this.atualizarAngulo(dirX, dirY);
        
        // Flag para sabermos se o tiro deve ser limpo do laço do jogo
        this.ativo = true;
    }

    atualizar(inimigos) {
        if (!this.ativo) return;

        // Avança o projétil em pixels baseado na velocidade e direção
        let proximoX = this.x + this.dirX * this.velocidade;
        let proximoY = this.y + this.dirY * this.velocidade;

        // Colisão com a arena
        if (proximoX < 0 || proximoX > this.arenaElement.offsetWidth ||
            proximoY < 0 || proximoY > this.arenaElement.offsetHeight) {
            this.destruir();
            return;
        }

        // Colisão com as parede
        const offX = (LARGURA_PERSONAGEM - this.largura) / 2;
        const offY = (ALTURA_PERSONAGEM - this.altura) / 2;
        let hitboxTiro = { x: proximoX + offX, y: proximoY + offY, largura: this.largura, altura: this.altura };

        if (this.colisao.estaColidindo(hitboxTiro)) {
            this.destruir();
            return;
        }

        // Colisão com os inimigos (dá dano neles)
        for (let inimigo of inimigos) {
            let hitboxInimigo = {
                x: inimigo.x + (LARGURA_PERSONAGEM - inimigo.largura) / 2,
                y: inimigo.y + (ALTURA_PERSONAGEM - inimigo.altura) / 2,
                largura: inimigo.largura,
                altura: inimigo.altura
            };

            // Se a hitbox do tiro encostar na hitbox do inimigo
            if (this.colisao._testarSobreposicao(hitboxTiro, hitboxInimigo)) {
                inimigo.vida -= 1; // Aplica dano ao inimigo
                if (inimigo.element) {
                    // Adiciona a classe de piscar qnd receber dano
                    inimigo.element.classList.add("piscar-dano");

                    // Remove o efeito após 100ms para o inimigo voltar à cor original
                    setTimeout(() => {
                        inimigo.element.classList.remove("piscar-dano");
                    }, 100);
                }

                this.destruir(); // Destrói o projétil
                return;
            }

        }

        // Se passou em todos os testes, efetiva o movimento
        this.x = proximoX;
        this.y = proximoY;
        this.renderizar();
    }

    destruir() {
        this.ativo = false;
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
        if (this.hitboxDebug && this.hitboxDebug.parentNode) {
            this.hitboxDebug.remove();
        }
    }

    atualizarAngulo(dx, dy) {  // Pra poder rotacionar a imagem do disparo certinho
        if (dx !== 0 || dy !== 0) {
            // Calcula o ângulo baseado na direção do movimento
            let anguloEmGraus = Math.atan2(dy, dx) * (180 / Math.PI);            
            this.angulo = anguloEmGraus;
        }
    }
}