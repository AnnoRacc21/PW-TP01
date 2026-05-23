export default class Colisao {
    constructor() {
        this.paredesDaArena = [ // Delimita as paredes da arena
                // --- CANTO SUPERIOR ESQUERDO ---
            { x: 122, y: 95, largura: 197  , altura: 45},  // Parte horizontal superior
            { x: 125, y: 95, largura: 20, altura: 250 },  // Parte vertical esquerda

            // --- CANTO SUPERIOR DIREITO ---
            { x: 415, y: 100, largura: 184, altura: 40 },  // Parte horizontal superior
            { x: 584, y: 100, largura: 19, altura: 250 },  // Parte vertical direita

            // --- CANTO INFERIOR ESQUERDO ---
            { x: 125, y: 410, largura: 25, altura: 200 },  // Parte vertical esquerda
            { x: 125, y: 571, largura: 190, altura: 40 },  // Parte horizontal inferior

            // --- CANTO INFERIOR DIREITO ---
            { x: 580, y: 400, largura: 25, altura: 210 },  // Parte vertical direita
            { x: 405, y: 565, largura: 200, altura: 45 }   // Parte horizontal inferior
        ];

        // // O código abaixo foi utilizado para pintar as hitbox da arena (tentativa e erro até ajustar certinho)

        // paredesDaArena.forEach(parede => {
        //         const visualBlock = document.createElement("div");
        //         visualBlock.style.position = "absolute";
        //         visualBlock.style.left = `${parede.x}px`;
        //         visualBlock.style.top = `${parede.y}px`;
        //         visualBlock.style.width = `${parede.largura}px`;
        //         visualBlock.style.height = `${parede.altura}px`;
        //         visualBlock.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Vermelho transparente
        //         visualBlock.style.zIndex = "999"; 
        //         this.container.appendChild(visualBlock);
        //     });

    }    

    _testarSobreposicao(retangulo1, retangulo2) { // Método matemático interno (AABB)
        return (
            retangulo1.x < retangulo2.x + retangulo2.largura &&
            retangulo1.x + retangulo1.largura > retangulo2.x &&
            retangulo1.y < retangulo2.y + retangulo2.altura &&
            retangulo1.y + retangulo1.altura > retangulo2.y
        );
    }

    estaColidindo(hitboxObjeto) { // recebe uma Hitbox temporária e diz se ela bate em alguma parede
        for (let parede of this.paredesDaArena) {
            if (this._testarSobreposicao(hitboxObjeto, parede)) {
                return true; // Se colidir para
            }
        }
        return false; // Caminho livre
    }
}