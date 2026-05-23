export default class Colisao {
    constructor(arenaElement) {
        this.arenaElement = arenaElement;

        // Paredes em percentual (x/largura_arena, y/altura_arena)
        // valores originais baseados em arena de 710 x 710 px
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
        // DEBUG — remove depois de calibrar
        setTimeout(() => {
            const w = this.arenaElement.offsetWidth;
            const h = this.arenaElement.offsetHeight;
            this.paredesRelativas.forEach(p => {
                const div = document.createElement("div");
                div.style.position   = "absolute";
                div.style.left       = `${p.xPct * w}px`;
                div.style.top        = `${p.yPct * h}px`;
                div.style.width      = `${p.larguraPct * w}px`;
                div.style.height     = `${p.alturaPct * h}px`;
                div.style.backgroundColor = "rgba(255,0,0,0.5)";
                div.style.zIndex     = "999";
                div.style.pointerEvents = "none";
                this.arenaElement.appendChild(div);
            });
        }, 100);

        // DEBUG + resize — dentro do constructor, depois do paredesRelativas
        this._desenharDebug = () => {
            // remove blocos antigos
            this.arenaElement.querySelectorAll(".debug-hitbox").forEach(d => d.remove());

            const w = this.arenaElement.offsetWidth;
            const h = this.arenaElement.offsetHeight;
            this.paredesRelativas.forEach(p => {
                const div = document.createElement("div");
                div.className             = "debug-hitbox";
                div.style.position        = "absolute";
                div.style.left            = `${p.xPct * w}px`;
                div.style.top             = `${p.yPct * h}px`;
                div.style.width           = `${p.larguraPct * w}px`;
                div.style.height          = `${p.alturaPct * h}px`;
                div.style.backgroundColor = "rgba(255,0,0,0.5)";
                div.style.zIndex          = "999";
                div.style.pointerEvents   = "none";
                this.arenaElement.appendChild(div);
            });
        };

        // desenha na primeira vez e toda vez que a arena mudar de tamanho
        this._resizeObserver = new ResizeObserver(() => this._desenharDebug());
        this._resizeObserver.observe(this.arenaElement);
    }

    

    // Converte percentuais para pixels no momento da checagem
    _getParedesPixels() {
        const w = this.arenaElement.offsetWidth;
        const h = this.arenaElement.offsetHeight;
        return this.paredesRelativas.map(p => ({
            x:       p.xPct       * w,
            y:       p.yPct       * h,
            largura: p.larguraPct * w,
            altura:  p.alturaPct  * h,
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
            if (this._testarSobreposicao(hitboxObjeto, parede)) {
                return true;
            }
        }
        return false;
    }
}