import EnemigoController from "./EnemigoController.js";
import Nave from "./Nave.js";
import BalasController from "./BalasController.js";
let menuPrincipal = true;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500 ;

let puntos = 0;

const background = new Image();
background.src = "images/space.png";

let balasNaveControl = new BalasController(canvas, 3, "#94ECFF ", true);
let balasEnemigoControl = new BalasController(canvas, 5, "#FF7C78 ", false);
let enemigoControl = new EnemigoController(canvas, balasEnemigoControl, balasNaveControl);
let naveControl = new Nave(canvas, 5, balasNaveControl);

let terminado = false;
let victoria = false;
let victorias = 0;

let enterPresionado = false;
function mostrarMenuPrincipal() {
    ctx.fillStyle = "#D6FFCA";
    ctx.font = "60px fuentePixel";
    ctx.shadowColor = "#59FF00";
    ctx.shadowBlur = 1;

    ctx.fillText("Bienvenido a Space Invaders", canvas.width / 2 - 420, canvas.height / 2 - 30);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    ctx.font = "30px fuentePixel";
    ctx.fillText("Presiona Enter para comenzar", canvas.width / 2 - 220, canvas.height / 2 + 70);
}

function reiniciarJuego() {
    terminado = false;
    victoria = false;
    enterPresionado = false;

    //Restablece los controladores y objetos del juego
    balasNaveControl = new BalasController(canvas, 3, "#94ECFF", true);
    balasEnemigoControl = new BalasController(canvas, 5, "#FF7C78", false);
    enemigoControl = new EnemigoController(canvas, balasEnemigoControl, balasNaveControl);
    naveControl = new Nave(canvas, 5, balasNaveControl);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (menuPrincipal) {
            enterPresionado = true;
            menuPrincipal = false;
        } else if (terminado) {
            reiniciarJuego();

        }
    }
});


function game() {
    if (menuPrincipal) {
        mostrarMenuPrincipal();
        if (terminado) {
            finJuego();
        }
    } else {
        verificaFinJuego();
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = "24px fuentePixel";
        ctx.fillStyle = "#D6FFCA";
        ctx.fillText("VICTORIAS CONSECUTIVAS: " + victorias, 20, canvas.height - 470); // Mostrar los puntos

        finJuego();
        if (!terminado) {
            enemigoControl.draw(ctx);
            naveControl.draw(ctx);
            balasNaveControl.draw(ctx);
            balasEnemigoControl.draw(ctx);
        }
    }
}


function finJuego() {
    if (terminado) {
        let text = victoria ? "VICTORIA" : "GAME OVER";

        //Estilos de la fuente
        ctx.fillStyle = "#D6FFCA";
        ctx.font = "100px fuentePixel";
        ctx.shadowColor = "#3AFF00"; // Color del resplandor
        ctx.shadowBlur = 10; // Tamaño del resplandor

        //Centrar texto en X e Y
        const textWidth = ctx.measureText(text).width;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height / 2;

        //Se dibuja el texto
        ctx.fillText(text, x, y);
        ctx.font = "30px fuentePixel";
        ctx.fillText("(Enter) para volver a jugar", canvas.width / 2 - 220, canvas.height / 2 + 70);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
    }
}

function verificaFinJuego() {
    if (terminado) {
        return;
    }

    if (balasEnemigoControl.collideWith(naveControl)) {
        terminado = true;
        victoria = false;
        if (!victoria && victorias > 0) {
            victorias = 0;
        }
    }

    if (enemigoControl.collideWith(naveControl)) {
        terminado = true;
        if (!victoria && victorias > 0) {
            victorias = 0;
        }
    }

    if (enemigoControl.enemigosFilas.length === 0) {
        victoria = true;
        terminado = true;
        if (victoria) {
            victorias++;
        }
    }
}

setInterval(game, 1000 / 60);
