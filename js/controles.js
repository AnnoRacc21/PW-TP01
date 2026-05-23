export default class Controles {
    constructor() {
        this.teclas = {};
        this.iniciarOuvintes();
    }

    iniciarOuvintes() {
        window.addEventListener("keydown", (e) => {
            this.teclas[e.code] = 1;
        });

        window.addEventListener("keyup", (e) => {
            this.teclas[e.code] = 0;
        });
    }

    estaPressionada(codigoTecla) {
        return this.teclas[codigoTecla] === 1;
    }
}