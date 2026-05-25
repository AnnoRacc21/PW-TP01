import {
    ALTURA_PERSONAGEM,
    LARGURA_PERSONAGEM
} from "./config.js";

export default class Colisao {

    constructor(arenaElement) {

        this.arenaElement = arenaElement;

        // Paredes em percentual
        this.paredesRelativas = [

            // CANTO SUPERIOR ESQUERDO
            { xPct: 0.172, yPct: 0.134, larguraPct: 0.277, alturaPct: 0.063 },
            { xPct: 0.176, yPct: 0.134, larguraPct: 0.028, alturaPct: 0.352 },

            // CANTO SUPERIOR DIREITO
            { xPct: 0.584, yPct: 0.141, larguraPct: 0.259, alturaPct: 0.056 },
            { xPct: 0.822, yPct: 0.141, larguraPct: 0.027, alturaPct: 0.352 },

            // CANTO INFERIOR ESQUERDO
            { xPct: 0.176, yPct: 0.577, larguraPct: 0.035, alturaPct: 0.282 },
            { xPct: 0.176, yPct: 0.804, larguraPct: 0.268, alturaPct: 0.056 },

            // CANTO INFERIOR DIREITO
            { xPct: 0.817, yPct: 0.563, larguraPct: 0.035, alturaPct: 0.296 },
            { xPct: 0.570, yPct: 0.795, larguraPct: 0.282, alturaPct: 0.063 },
        ];

        // desenha paredes debug
        this._desenharParedesDebug();

        this._resizeObserver = new ResizeObserver(() => {
            this._desenharParedesDebug();
        });

        this._resizeObserver.observe(this.arenaElement);
    }

    _desenharParedesDebug() {

        this.arenaElement
            .querySelectorAll(".debug-parede")
            .forEach(d => d.remove());

        const w = this.arenaElement.offsetWidth;
        const h = this.arenaElement.offsetHeight;

        this.paredesRelativas.forEach(p => {

            const div = document.createElement("div");

            div.className = "debug-parede";

            div.style.position = "absolute";
            div.style.left = `${p.xPct * w}px`;
            div.style.top = `${p.yPct * h}px`;

            div.style.width =
                `${p.larguraPct * w}px`;

            div.style.height =
                `${p.alturaPct * h}px`;

            div.style.backgroundColor =
                "rgba(255,0,0,0.5)";

            div.style.pointerEvents = "none";
            div.style.zIndex = "999";

            this.arenaElement.appendChild(div);
        });
    }

    desenharHitboxEntidade(entidade, cor = "lime") {

        if (!entidade.debugHitbox) {

            entidade.debugHitbox =
                document.createElement("div");

            entidade.debugHitbox.style.position =
                "absolute";

            entidade.debugHitbox.style.pointerEvents =
                "none";

            entidade.debugHitbox.style.zIndex =
                "1000";

            this.arenaElement.appendChild(
                entidade.debugHitbox
            );
        }

        // centraliza hitbox
        const offX =
            (LARGURA_PERSONAGEM - entidade.largura) / 2;

        const offY =
            (ALTURA_PERSONAGEM - entidade.altura) / 2;

        entidade.debugHitbox.style.left =
            `${entidade.x + offX}px`;

        entidade.debugHitbox.style.top =
            `${entidade.y + offY}px`;

        entidade.debugHitbox.style.width =
            `${entidade.largura}px`;

        entidade.debugHitbox.style.height =
            `${entidade.altura}px`;

        entidade.debugHitbox.style.border =
            `2px solid ${cor}`;

        entidade.debugHitbox.style.backgroundColor =
            cor === "red"
                ? "rgba(255,0,0,0.2)"
                : "rgba(0,255,0,0.2)";
    }

    _getParedesPixels() {

        const w = this.arenaElement.offsetWidth;
        const h = this.arenaElement.offsetHeight;

        return this.paredesRelativas.map(p => ({
            x: p.xPct * w,
            y: p.yPct * h,
            largura: p.larguraPct * w,
            altura: p.alturaPct * h,
        }));
    }

    _testarSobreposicao(r1, r2) {

        return (
            r1.x < r2.x + r2.largura &&
            r1.x + r1.largura > r2.x &&
            r1.y < r2.y + r2.altura &&
            r1.y + r1.altura > r2.y
        );
    }

    estaColidindo(hitboxObjeto) {

        for (let parede of this._getParedesPixels()) {

            if (this._testarSobreposicao(
                hitboxObjeto,
                parede
            )) {
                return true;
            }
        }

        return false;
    }
}