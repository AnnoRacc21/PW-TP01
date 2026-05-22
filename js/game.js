(function () {

    const FPS = 60;
    const HEIGHT = 720;
    const WIDTH = 1024;

    let gameLoop;
    let arena;
    let jogador;

    function init(){
        gameLoop = setInterval(run, 1000 / FPS)
        arena = new Arena();
        jogador = new Jogador();
    }

    window.addEventListener("keydown", (e) => {
        jogador.teclasPressionadas[e.code] = 1;
    })

    window.addEventListener("keyup", (e) => {
        jogador.teclasPressionadas[e.code] = 0;
    })

    class Arena {
        constructor() {
            this.element = document.createElement("div")
            this.element.className = "arena";
            this.element.style.height = `${HEIGHT}px`;
            this.element.style.width = `${WIDTH}px`;

            document.getElementById("game").appendChild(this.element)

            this.chao = document.createElement("div")
            this.chao.className = "chao";
            this.element.appendChild(this.chao)
        }
    }

    class Jogador {
        teclasPressionadas = {
            KeyW: false,
            KeyS: false,
            KeyA: false,
            KeyD: false,
        }
        
        constructor() {
            this.element = document.createElement("div")
            this.movimentacaoX = 0; //1- subindo, -1 - descendo
            this.movimentacaoY = 0; //1- direita, -1 - esquerda
            this.element.className = "jogador";
            this.element.style.left = "482px"
            this.element.style.top = "330px"
            arena.element .appendChild(this.element)
        }
        corre() {
            this.movimentacaoX = this.teclasPressionadas["KeyW"] - this.teclasPressionadas["KeyS"]
            console.log(this.movimentacaoX)
            this.movimentacaoY = this.teclasPressionadas["KeyD"] - this.teclasPressionadas["KeyA"]
            console.log(this.movimentacaoY)
            jogador.element.style.top = `${parseInt(jogador.element.style.top) - this.movimentacaoX*3}px`
            jogador.element.style.left = `${parseInt(jogador.element.style.left) + this.movimentacaoY*3}px`
            
        }
    }

    function run() {
        jogador.corre()
    }

    init()

}) ()