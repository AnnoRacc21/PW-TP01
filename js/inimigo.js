import Entidade from "./entidade.js";
import {ALTURA_PERSONAGEM, LARGURA_PERSONAGEM} from "./config.js"

export class Inimigo extends Entidade {

    constructor(arenaElement, colisao, tipo, vida, velocidade) {

        super(
            arenaElement,
            colisao,
            tipo,
            velocidade,
            vida
        );

        this.spawnarNasBordas(arenaElement);

        this.renderizar();
    }

    spawnarNasBordas(arenaElement) {

        const larguraArena = arenaElement.offsetWidth;
        const alturaArena  = arenaElement.offsetHeight;

        const lado = Math.floor(Math.random() * 4);

        switch (lado) {

            // TOPO
            case 0:
                this.x = Math.random() * (larguraArena - LARGURA_PERSONAGEM);
                this.y = -ALTURA_PERSONAGEM;
                break;

            // DIREITA
            case 1:
                this.x = larguraArena + LARGURA_PERSONAGEM;
                this.y = Math.random() * (alturaArena - ALTURA_PERSONAGEM);
                break;

            // BAIXO
            case 2:
                this.x = Math.random() * (larguraArena - LARGURA_PERSONAGEM);
                this.y = alturaArena + ALTURA_PERSONAGEM;
                break;

            // ESQUERDA
            case 3:
                this.x = -LARGURA_PERSONAGEM;
                this.y = Math.random() * (alturaArena - ALTURA_PERSONAGEM);
                break;
        }
    }

    // ta usando o A-estrela para saber aonde o jogador está e buscar ele (objetivo que calcule somente os próximos 4 passos para evitar gastar muita memória)
    buscaJogador(jogador) {

        const TAMANHO_GRID = 64;
        const MAX_PASSOS = 4;

        const inicio = {
            x: Math.floor(this.x / TAMANHO_GRID),
            y: Math.floor(this.y / TAMANHO_GRID)
        };

        const fim = {
            x: Math.floor(jogador.x / TAMANHO_GRID),
            y: Math.floor(jogador.y / TAMANHO_GRID)
        };

        const aberta = [];
        const fechada = new Set();

        aberta.push({
            x: inicio.x,
            y: inicio.y,
            g: 0,
            h: this.heuristica(
                inicio.x,
                inicio.y,
                fim.x,
                fim.y
            ),
            pai: null
        });

        while (aberta.length > 0) {

            aberta.sort(
                (a, b) => (a.g + a.h) - (b.g + b.h)
            );

            const atual = aberta.shift();

            fechada.add(`${atual.x},${atual.y}`);

            // ====================================
            // limite de profundidade
            // ====================================

            if (atual.g >= MAX_PASSOS) {

                this.moverParaNodo(
                    atual,
                    TAMANHO_GRID
                );

                return;
            }

            // chegou no jogador
            if (
                atual.x === fim.x &&
                atual.y === fim.y
            ) {

                this.moverParaNodo(
                    atual,
                    TAMANHO_GRID
                );

                return;
            }

            const direcoes = [

                {x:  1, y:  0},
                {x: -1, y:  0},
                {x:  0, y:  1},
                {x:  0, y: -1},

                {x:  1, y:  1},
                {x: -1, y: -1},
                {x:  1, y: -1},
                {x: -1, y:  1},
            ];

            for (const dir of direcoes) {

                const vizinhoX = atual.x + dir.x;
                const vizinhoY = atual.y + dir.y;

                const chave =
                    `${vizinhoX},${vizinhoY}`;

                if (fechada.has(chave)) {
                    continue;
                }

                const hitbox = {
                    x: vizinhoX * TAMANHO_GRID,
                    y: vizinhoY * TAMANHO_GRID,
                    largura: this.largura,
                    altura: this.altura
                };

                if (
                    this.colisao.estaColidindo(hitbox)
                ) {
                    continue;
                }

                const custo =
                    (dir.x !== 0 && dir.y !== 0)
                        ? 1.4
                        : 1;

                const g = atual.g + custo;

                const existente = aberta.find(
                    n =>
                        n.x === vizinhoX &&
                        n.y === vizinhoY
                );

                if (!existente) {

                    aberta.push({

                        x: vizinhoX,
                        y: vizinhoY,

                        g: g,

                        h: this.heuristica(
                            vizinhoX,
                            vizinhoY,
                            fim.x,
                            fim.y
                        ),

                        pai: atual
                    });

                } else if (g < existente.g) {

                    existente.g = g;
                    existente.pai = atual;
                }
            }
        }
    }

    // heurística diagonal (Octile Distance) já que podem se mover nas 8 direções
    heuristica(x1, y1, x2, y2) {

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        return (
            (dx + dy) +
            (Math.sqrt(2) - 2) * Math.min(dx, dy)
        );
    }

    moverParaNodo(nodo, TAMANHO_GRID) {

        const alvoX =
            nodo.x * TAMANHO_GRID;

        const alvoY =
            nodo.y * TAMANHO_GRID;

        const dx = alvoX - this.x;
        const dy = alvoY - this.y;

        const distancia =
            Math.sqrt(dx * dx + dy * dy);

        if (distancia > 0) {

            this.x +=
                (dx / distancia) *
                this.velocidade;

            this.y +=
                (dy / distancia) *
                this.velocidade;
        }

        this.renderizar();
    }
}


