export default class Arena {
        constructor(altura, largura) {
            this.element = document.createElement("div")
            this.element.className = "arena";
            this.element.style.height = `${altura}px`;
            this.element.style.width = `${largura}px`;

            document.getElementById("game").appendChild(this.element)

            this.chao = document.createElement("div")
            this.chao.className = "chao";
            this.element.appendChild(this.chao)
        }
    }