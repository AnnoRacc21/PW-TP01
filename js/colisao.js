import Arena from "./arena";
import Jogador from "./jogador";

export function colisao_jogador_arena(Jogador, Arena){
    if (Jogador.x < Arena.x + Arena.width && Jogador.x + Jogador.width > Arena.x && Jogador.y < Arena.y + Arena.height && Jogador.y + Jogador.height > Arena.y){
        console.log("Colisão jogador e arena");

    }
}

export function colisao_jogador_inimigo(Jogador, Inimigo){

}

export function colisao_entidade_ataque(Jogador, Ataque){

}