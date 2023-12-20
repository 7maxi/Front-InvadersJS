import Enemigo from "./Enemigo.js";
import DireccionMov from "./DireccionMov.js";
let enemigosDerrotados = 0;

export default class EnemigoController {
  enemigosMap = [
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [2, 1, 2, 3, 3, 3, 3, 2, 1, 2],
    [2, 2, 1, 3, 3, 3, 3, 1, 2, 2],
    [0, 1, 0, 3, 3, 3, 3, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  enemigosFilas = [];

  currentDirection = DireccionMov.right;

  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1.5;
  defaultYVelocity = 1;
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;
  temporizadorBalas = 27;
  balasTiming = this.temporizadorBalas;

  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;

    this.enemyDeathSound = new Audio("sonido/enemy-death.wav");
    this.enemyDeathSound.volume = 0.1;

    this.crearEnemigos();
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.actualizaVelDir();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection() {
    this.enemigosFilas.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.enemyDeathSound.currentTime = 0;
          this.enemyDeathSound.play();
          enemyRow.splice(enemyIndex, 1);
          enemigosDerrotados++;
        }
      });
    });

    this.enemigosFilas = this.enemigosFilas.filter((enemyRow) => enemyRow.length > 0);
  }

  //Balas de los enemigos
  fireBullet() {
    //Baja el temporizador del disparo
    this.balasTiming--;
    //Cuando el temporizador este a 0 se dispara
    if (this.balasTiming <= 0) {
      this.balasTiming = this.temporizadorBalas;
      //Obtiene todos los enemigos y se elige uno aleatorio para disparar
      const allEnemies = this.enemigosFilas.flat();
      const nEnemigo = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[nEnemigo];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === DireccionMov.downLeft ||
      this.currentDirection === DireccionMov.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  getEnemigosDerrotados() {
    return enemigosDerrotados;
  }

  actualizaVelDir() {
    for (const enemyRow of this.enemigosFilas) {
      //Detecta hacia que direccion se mueven los enemigos y decide cual es la siguiente
      if (this.currentDirection === DireccionMov.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = DireccionMov.downLeft;
          break;
        }
      } else if (this.currentDirection === DireccionMov.downLeft) {
        if (this.moverAbajo(DireccionMov.left)) {
          break;
        }
      } else if (this.currentDirection === DireccionMov.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = DireccionMov.downRight;
          break;
        }
      } else if (this.currentDirection === DireccionMov.downRight) {
        if (this.moverAbajo(DireccionMov.right)) {
          break;
        }
      }
    }
  }

  moverAbajo(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx) {
    this.enemigosFilas.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  happy = () => {};

  crearEnemigos() {
    //Se recorre el mapa de enemigos
    this.enemigosMap.forEach((row, rowIndex) => {
      //Crea un array vacío para la fila actual de enemigos
      this.enemigosFilas[rowIndex] = [];
      row.forEach((enemyNubmer, enemyIndex) => {
        if (enemyNubmer > 0) {
          //Espacio entre enemigos
          const espacioEnemyX = 70;
          const espacioEnemyY = 50;

          //Crea un nuevo enemigo en las coordenadas establecidas
          this.enemigosFilas[rowIndex].push(
              new Enemigo(enemyIndex * espacioEnemyX, (rowIndex + 1) * espacioEnemyY, enemyNubmer)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    //Verificamos la colision con sprite
    //Si colisiona un enemigo devuelve true
    return this.enemigosFilas.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
