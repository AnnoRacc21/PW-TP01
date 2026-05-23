export default class Arena {
        constructor(altura, largura) {
            this.element = document.createElement("div")
            this.element.className = "arena1";
            this.element.style.height = `${altura}vh`;
            this.element.style.width = `${largura}vh`;

            document.getElementById("cenario-jogo").appendChild(this.element)
        }
    }